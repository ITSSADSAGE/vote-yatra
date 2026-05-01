const API_URL = 'http://localhost:3000/api/guide';

let currentSteps = [];
let currentStepIndex = 0;
let simStepIndex = 0;
let selectedPersona = null;
let selectedAge = null;

const SIMULATION_STEPS = [
    { title: "Identity Verification", description: "Show your Voter ID to the first polling officer to verify your name in the roll.", feedback: "Name verified on the electoral roll!" },
    { title: "Inking and Signature", description: "The second officer will ink your finger and take your signature.", feedback: "Indelible ink applied. Signature recorded." },
    { title: "EVM Entry", description: "The third officer will enable the EVM. Enter the voting compartment.", feedback: "EVM is now ready for your vote." },
    { title: "Cast Your Vote", description: "Press the blue button next to your candidate's symbol. Wait for the beep.", feedback: "VVPAT slip printed. Vote successfully recorded!" }
];

const DEMO_STEPS = [
    { title: "Step 1: Check Registration", description: "Voters check their name in the electoral search portal.", insight: "Ensures legal eligibility.", action: "Visit voters.eci.gov.in", tip: "Always have your EPIC number ready." },
    { title: "Step 2: Reach Polling Booth", description: "On election day, voters go to their assigned polling station.", insight: "Ensures local representation.", action: "Check Voter Helpline App for booth location", tip: "Reach early to avoid long queues." },
    { title: "Step 3: Identity Check", description: "Officers verify ID and apply indelible ink on the finger.", insight: "Prevents duplicate voting.", action: "Show Voter ID or Aadhaar", tip: "Indelible ink is a mark of pride!" },
    { title: "Step 4: Press the Button", description: "Inside the booth, press the button on the EVM for your chosen candidate.", insight: "The core act of democracy.", action: "Press button and listen for the beep", tip: "Check the VVPAT slip through the glass." }
];

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const personaSection = document.getElementById('persona-section');
    const journeySection = document.getElementById('journey-section');
    const simulationSection = document.getElementById('simulation-section');
    const stepsContainer = document.getElementById('steps-container');
    const simulationContent = document.getElementById('simulation-content');
    const decisionBanner = document.getElementById('decision-banner');
    const progressBar = document.getElementById('progress-bar');
    const personaBtns = document.querySelectorAll('.persona-btn');
    const ageInput = document.getElementById('user-age');
    const nextBtn = document.getElementById('next-step');
    const prevBtn = document.getElementById('prev-step');
    const startSimBtn = document.getElementById('start-simulation');
    const simNextBtn = document.getElementById('sim-next-btn');
    const restartBtn = document.getElementById('restart-btn');
    const errorDisplay = document.getElementById('error-display');
    const demoBtn = document.getElementById('demo-journey-btn');

    function determineUserPath(age, status) {
        if (age < 18) return `You are not eligible yet. Focus on learning about Indian democracy for now!`;
        if (status === "not-registered") return `You are not registered. Let’s get you on the Electoral Roll first.`;
        if (status === "first-time") return `You are a first-time voter. Let’s get you ready step-by-step.`;
        return `You are already registered. Let’s verify your details for election day.`;
    }

    personaBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const ageStr = ageInput.value.trim();
            const age = parseInt(ageStr);
            const persona = btn.getAttribute('data-persona');

            if (!ageStr || isNaN(age)) {
                showError('Please enter a valid age.');
                return;
            }

            if (age < 18) {
                showError('You must be at least 18 to vote in India. You can still explore how the voting process works.');
                personaBtns.forEach(btn => btn.classList.add('disabled'));
                demoBtn.classList.remove('hidden');
                return;
            }

            // Store for use in summary screen
            selectedAge = age;
            selectedPersona = persona;

            const decision = determineUserPath(age, persona);
            decisionBanner.textContent = `Based on your input: ${decision}`;

            try {
                btn.disabled = true;
                btn.textContent = 'Loading AI Guide...';

                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ age: age, voterStatus: persona })
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Failed to fetch guide');

                if (data.eligible === false) {
                    showError(data.message);
                    return;
                }

                currentSteps = data.steps;
                startJourney();
            } catch (err) {
                showError(err.message);
            } finally {
                btn.disabled = false;
                const LABELS = {
                    'first-time': 'I am a first-time voter',
                    'not-registered': 'I am not registered yet',
                    'already-registered': 'I am already registered'
                };
                btn.textContent = LABELS[btn.getAttribute('data-persona')] || btn.getAttribute('data-persona');
            }
        });
    });

    function startJourney() {
        currentStepIndex = 0;
        personaSection.classList.add('hidden');
        journeySection.classList.remove('hidden');
        updateStepsUI();
    }

    function updateStepsUI() {
        const step = currentSteps[currentStepIndex];
        const progress = ((currentStepIndex + 1) / currentSteps.length) * 100;

        progressBar.style.width = `${progress}%`;

        stepsContainer.innerHTML = `
            <p class="step-counter">Step ${currentStepIndex + 1} — ${step.title}</p>

            <div class="step-card fade-in">
                <h3 class="step-title">${step.title}</h3>
                <p class="step-desc">${step.description}</p>

                ${step.insight ? `
                <p class="step-insight"><em>Why this matters:</em> ${step.insight}</p>` : ''}

                ${step.action ? `
                <div class="step-action">▶ ${step.action}</div>` : ''}

                ${step.tip ? `
                <div class="pro-tip">💡 <strong>Tip:</strong> ${step.tip}</div>` : ''}
            </div>
        `;

        prevBtn.style.visibility = currentStepIndex === 0 ? 'hidden' : 'visible';
        
        if (currentStepIndex === currentSteps.length - 1) {
            nextBtn.classList.add('hidden');
            startSimBtn.classList.remove('hidden');
        } else {
            nextBtn.classList.remove('hidden');
            startSimBtn.classList.add('hidden');
        }
    }

    nextBtn.addEventListener('click', () => {
        if (currentStepIndex < currentSteps.length - 1) {
            currentStepIndex++;
            updateStepsUI();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStepIndex > 0) {
            currentStepIndex--;
            updateStepsUI();
        }
    });

    // Simulation Logic
    startSimBtn.addEventListener('click', () => {
        journeySection.classList.add('hidden');
        simulationSection.classList.remove('hidden');
        simStepIndex = 0;
        updateSimulationUI();
    });

    function updateSimulationUI() {
        const step = SIMULATION_STEPS[simStepIndex];
        
        simulationContent.innerHTML = `
            <div class="step-card fade-in">
                <h3 style="color: var(--primary);">Simulation Step ${simStepIndex + 1}</h3>
                <h4 style="margin-bottom: 1rem; color: white;">${step.title}</h4>
                <p>${step.description}</p>
                <div id="sim-feedback" class="hidden" style="color: var(--secondary); font-weight: 600; margin-top: 1rem;">
                    ✓ ${step.feedback}
                </div>
            </div>
        `;

        simNextBtn.textContent = simStepIndex === SIMULATION_STEPS.length - 1 ? "Complete VoteYatra" : "Next Action";
        simNextBtn.classList.remove('hidden');
        restartBtn.classList.add('hidden');
    }

    simNextBtn.addEventListener('click', () => {
        const feedback = document.getElementById('sim-feedback');
        
        if (feedback.classList.contains('hidden')) {
            // First click: Show feedback
            feedback.classList.remove('hidden');
            if (simStepIndex === SIMULATION_STEPS.length - 1) {
                simNextBtn.textContent = "Finish Journey";
            }
        } else {
            // Second click: Go to next step
            if (simStepIndex < SIMULATION_STEPS.length - 1) {
                simStepIndex++;
                updateSimulationUI();
            } else {
                showCompletion();
            }
        }
    });

    function showCompletion() {
        // Build key takeaways based on persona selected
        const TAKEAWAYS = {
            'first-time': [
                '✅ You are now eligible to vote as an 18+ Indian citizen.',
                '✅ Your Voter ID and Electoral Roll registration are your keys to the booth.',
                '✅ First-time voters like you are shaping India\'s future.'
            ],
            'not-registered': [
                '✅ Registration via Form 6 on voters.eci.gov.in is your immediate next step.',
                '✅ Once registered, you will appear on the Electoral Roll.',
                '✅ Every registered voter strengthens democracy.'
            ],
            'already-registered': [
                '✅ You are verified and ready to vote on election day.',
                '✅ Carry your Voter ID or Aadhaar to the polling booth.',
                '✅ Your vote directly decides who represents your constituency.'
            ]
        };

        const takeaways = TAKEAWAYS[selectedPersona] || TAKEAWAYS['already-registered'];
        const takeawayHTML = takeaways.map(t => `<li style="text-align:left; margin-bottom: 0.6rem; color: #cbd5e1;">${t}</li>`).join('');

        simulationContent.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">🇮🇳</div>

                <h2 style="color: var(--secondary); margin-bottom: 0.5rem;">VoteYatra Complete!</h2>
                <p style="color: white; font-size: 1.1rem; margin-bottom: 2rem;">You have successfully completed your VoteYatra.</p>

                <!-- Key Takeaways -->
                <div style="background: rgba(255,255,255,0.05); border-radius: 10px; padding: 1.5rem; text-align: left; margin-bottom: 2rem; border: 1px solid #334155;">
                    <p style="font-weight: 800; color: var(--primary); margin-bottom: 1rem;">Key Takeaways</p>
                    <ul style="list-style: none; padding: 0; margin: 0;">
                        ${takeawayHTML}
                    </ul>
                </div>

                <!-- Motivational Quote -->
                <div style="border-left: 4px solid var(--primary); padding: 1rem 1.5rem; text-align: left; background: rgba(255,153,51,0.06); border-radius: 0 8px 8px 0; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.2rem; font-weight: 800; color: white; margin: 0;">"Your vote is your voice."</p>
                    <p style="font-size: 0.85rem; color: #64748b; margin: 0.3rem 0 0;">Exercise it with knowledge. Exercise it with pride.</p>
                </div>
            </div>
        `;

        simNextBtn.classList.add('hidden');
        restartBtn.classList.remove('hidden');
        restartBtn.textContent = "Explore Another Journey";
    }

    restartBtn.addEventListener('click', () => {
        simulationSection.classList.add('hidden');
        personaSection.classList.remove('hidden');
        currentSteps = [];
        currentStepIndex = 0;
        selectedPersona = null;
        selectedAge = null;
        ageInput.value = '';
    });

    function showError(message) {
        errorDisplay.textContent = message;
        errorDisplay.classList.remove('hidden');
    }

    function clearError() {
        errorDisplay.textContent = '';
        errorDisplay.classList.add('hidden');
    }

    // Real-time age validation and UX feedback
    ageInput.addEventListener('input', () => {
        const ageStr = ageInput.value.trim();
        const age = parseInt(ageStr);
        clearError();

        if (ageStr.length >= 2) {
            if (age < 18) {
                personaBtns.forEach(btn => btn.classList.add('disabled'));
                demoBtn.classList.remove('hidden');
                showError('You must be at least 18 to vote in India. You can still explore how the voting process works.');
            } else {
                personaBtns.forEach(btn => btn.classList.remove('disabled'));
                demoBtn.classList.add('hidden');
            }
        } else {
            // Under 2 digits: Clear errors but keep buttons visually disabled
            personaBtns.forEach(btn => btn.classList.add('disabled'));
            demoBtn.classList.add('hidden');
        }
    });

    demoBtn.addEventListener('click', () => {
        selectedPersona = 'already-registered'; // Set a default for completion screen
        currentSteps = DEMO_STEPS;
        decisionBanner.textContent = "Viewing Demo Journey: Here is how the voting process works in India.";
        startJourney();
    });
});
