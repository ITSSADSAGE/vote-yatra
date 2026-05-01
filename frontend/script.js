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

    function determineUserPath(age, status) {
        if (age < 18) return `You must be 18 or older to vote in India. Focus on learning about our democracy for now!`;
        if (status === "not-registered") return `Voter registration is your first step. You need to be on the Electoral Roll to cast your vote.`;
        if (status === "first-time") return `Welcome to your first election! We'll guide you through registration and your first trip to the booth.`;
        return `You're all set to exercise your right! Let's verify your booth details and prepare for election day.`;
    }

    personaBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const age = parseInt(ageInput.value);
            const persona = btn.getAttribute('data-persona');

            if (!ageInput.value) {
                showError('Please enter your age first.');
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
                btn.textContent = btn.getAttribute('data-persona').replace('-', ' ');
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
            <div class="step-card">
                <h3>${step.title}</h3>
                <p>${step.description}</p>
                ${step.insight ? `
                <p style="font-size: 0.85rem; color: #64748b; font-style: italic; margin-top: -0.5rem; margin-bottom: 1rem;">
                    <strong>Why this matters:</strong> ${step.insight}
                </p>` : ''}
                ${step.action ? `
                <p style="font-size: 0.9rem; color: #7dd3fc; font-weight: 600; margin-bottom: 1rem; background: rgba(125,211,252,0.07); padding: 0.7rem 1rem; border-radius: 8px; border-left: 3px solid #7dd3fc;">
                    ▶ Action: ${step.action}
                </p>` : ''}
                ${step.tip ? `
                <div class="pro-tip">
                    <strong>💡 Pro-Tip:</strong> ${step.tip}
                </div>` : ''}
            </div>
            <p style="font-size: 0.9rem; font-weight: 600; color: var(--primary);">Step ${currentStepIndex + 1} of ${currentSteps.length}</p>
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
            <div class="step-card sim-step-card">
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
        alert(message);
    }
});
