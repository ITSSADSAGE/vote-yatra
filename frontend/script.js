/**
 * Controller (script.js)
 * Orchestrates the application logic and interacts with modular components.
 */

document.addEventListener('DOMContentLoaded', () => {
    // State
    let currentUser = null;
    let currentFlowName = null;
    let currentSteps = [];
    let currentStepIndex = 0;
    let lastPersona = null;

    // DOM Elements
    const ageInput = document.getElementById('user-age');
    const personaBtns = document.querySelectorAll('.persona-btn');
    const demoBtn = document.getElementById('demo-journey-btn');
    const langSelect = document.getElementById('lang-select');
    const errorDisplay = document.getElementById('error-display');
    
    // Navigation Buttons
    const nextBtn = document.getElementById('next-step');
    const prevBtn = document.getElementById('prev-step');
    const nextLearningBtn = document.getElementById('next-learning');
    const prevLearningBtn = document.getElementById('prev-learning');
    const startSimBtn = document.getElementById('start-simulation');
    const restartBtn = document.getElementById('restart-btn');

    // Initialize Engines
    LanguageEngine.init();
    UIRenderer.init();

    // Set initial language in select
    langSelect.value = LanguageEngine.currentLanguage;

    // ── Source Indicator ──────────────────────────────────────────────
    const SourceIndicator = {
        set: (source) => {
            const badge = document.getElementById('source-badge');
            const text = document.getElementById('source-badge-text');
            if (!badge || !text) return;

            badge.className = 'source-badge';
            if (source === 'gemini') {
                badge.classList.add('source-badge--gemini');
                text.innerHTML = '✨ Personalized by Google Gemini AI';
            } else if (source === 'cache') {
                badge.classList.add('source-badge--cache');
                text.innerHTML = '⚡ Optimized via Google Smart Cache';
            } else {
                badge.classList.add('source-badge--eci');
                text.innerHTML = '📜 Verified ECI Official Guidelines';
            }
        }
    };

    // --- Handlers ---

    const showLoading = () => {
        // Hide persona section, show a loading card in the journey section
        document.getElementById('persona-section').classList.add('hidden');
        const journeySection = document.getElementById('journey-section');
        journeySection.classList.remove('hidden');
        document.getElementById('steps-container').innerHTML = `
            <div class="loading-state">
                <div class="loading-spinner"></div>
                <p class="loading-text">Generating your personalised journey…</p>
            </div>
        `;
        // Hide nav buttons and badge while loading
        document.getElementById('source-badge').classList.add('hidden');
        document.querySelector('.nav-buttons').style.visibility = 'hidden';
        document.getElementById('find-booth-btn').style.visibility = 'hidden';
    };

    const handlePersonaClick = async (persona, isLanguageSwitch = false) => {
        const ageVal = parseInt(ageInput.value);
        const isDemo = (persona === 'underage' || persona === 'learning');
        
        // If demo/underage, we don't strictly need a valid age, default to 17
        const age = (isDemo && (isNaN(ageVal) || ageVal <= 0)) ? 17 : ageVal;

        if (isNaN(age) || age <= 0) {
            showError(LanguageEngine.getText('error_age'));
            return;
        }

        // 1. Determine User Persona
        currentUser = PersonaEngine.determineUser(age, persona);

        // 2. Select Flow Name
        if (currentUser.mode === "learning") {
            currentFlowName = "LEARNING_FLOW";
        } else {
            switch(currentUser.persona) {
                case "not-registered": currentFlowName = "NOT_REGISTERED_FLOW"; break;
                case "first-time":     currentFlowName = "FIRST_TIME_FLOW";     break;
                case "returning":      currentFlowName = "RETURNING_FLOW";       break;
                default:               currentFlowName = "RETURNING_FLOW";
            }
        }

        // Only reset index if we are NOT switching language
        if (!isLanguageSwitch) {
            currentStepIndex = 0;
        }

        // 3. Learning mode — no API needed, go straight in
        if (currentUser.mode === "learning") {
            const steps = applySafeguards(Flows.getFlow(currentFlowName, LanguageEngine.currentLanguage), currentUser.persona);
            currentSteps = steps;
            UIRenderer.renderLearningJourney(currentSteps, currentStepIndex);
            SourceIndicator.set('eci'); // Learning is always from static guidelines
            return;
        }

        // 4. Show loading state while Gemini responds
        showLoading();

        let steps = null;
        let source = 'eci';

        try {
            const res = await fetch('/api/guide', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ age, voterStatus: persona, language: LanguageEngine.currentLanguage })
            });

            if (res.ok) {
                const data = await res.json();
                source = data.source || 'eci';
                if (Array.isArray(data.steps) && data.steps.length > 0) {
                    steps = applySafeguards(data.steps, currentUser.persona);
                }
            }
        } catch (err) {
            console.warn('[VoteYatra] API unreachable, using local ECI flow:', err.message);
        }

        // 5. If Gemini failed or returned nothing, use local ECI flow
        if (!steps) {
            const lang = LanguageEngine.currentLanguage;
            steps = applySafeguards(Flows.getFlow(currentFlowName, lang), currentUser.persona);
            source = 'eci';
        }

        // 6. Restore nav visibility
        document.querySelector('.nav-buttons').style.visibility = 'visible';
        document.getElementById('find-booth-btn').style.visibility = 'visible';

        // 7. Render journey
        currentSteps = steps;
        UIRenderer.renderVotingJourney(currentSteps, currentStepIndex);
        LanguageEngine.applyLanguage();
        SourceIndicator.set(source);
    };

    const applySafeguards = (steps, persona) => {
        let filteredSteps = [...steps];

        // Safeguard: If persona !== "not-registered", remove any step containing "register"
        if (persona !== "not-registered") {
            filteredSteps = filteredSteps.filter(step => 
                !step.title.toLowerCase().includes('register') && 
                !step.description.toLowerCase().includes('register')
            );
        }
        
        return filteredSteps;
    };

    // --- Event Listeners ---

    personaBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const persona = btn.getAttribute('data-persona');
            lastPersona = persona;
            handlePersonaClick(persona);
        });
    });

    demoBtn.addEventListener('click', () => {
        lastPersona = 'underage';
        handlePersonaClick('underage'); // Force learning flow
    });

    langSelect.addEventListener('change', (e) => {
        LanguageEngine.setLanguage(e.target.value);
    });

    window.addEventListener('languageChanged', () => {
        if (!currentFlowName || !currentUser || !lastPersona) return;
        // Re-run handlePersonaClick with language switch mode
        handlePersonaClick(lastPersona, true);
        LanguageEngine.applyLanguage();
    });

    // Navigation Logic
    const navigate = (direction) => {
        const newIndex = currentStepIndex + direction;
        if (newIndex >= 0 && newIndex < currentSteps.length) {
            currentStepIndex = newIndex;
            if (currentUser.mode === "learning") {
                UIRenderer.renderLearningJourney(currentSteps, currentStepIndex);
            } else {
                UIRenderer.renderVotingJourney(currentSteps, currentStepIndex);
            }
            LanguageEngine.applyLanguage();
        }
    };

    nextBtn.addEventListener('click', () => navigate(1));
    prevBtn.addEventListener('click', () => navigate(-1));
    nextLearningBtn.addEventListener('click', () => navigate(1));
    prevLearningBtn.addEventListener('click', () => navigate(-1));

    restartBtn.addEventListener('click', () => {
        UIRenderer.showPersonaSection();
        ageInput.value = '';
        currentFlowName = null;
        errorDisplay.classList.add('hidden');
    });

    // Simple Age Validation UX
    ageInput.addEventListener('input', () => {
        const age = parseInt(ageInput.value);
        errorDisplay.classList.add('hidden');
        
        if (ageInput.value.length >= 2) {
            if (age < 18) {
                personaBtns.forEach(btn => btn.classList.add('disabled'));
                demoBtn.classList.remove('hidden');
                showError(LanguageEngine.getText('error_underage'));
            } else {
                personaBtns.forEach(btn => btn.classList.remove('disabled'));
                demoBtn.classList.add('hidden');
            }
        }
    });

    function showError(message) {
        errorDisplay.textContent = message;
        errorDisplay.classList.remove('hidden');
    }

    // ── Booth Locator — Geolocation + Maps Integration ──────────
    const boothBtn = document.getElementById('find-booth-btn');
    const boothModal = document.getElementById('booth-modal');
    const closeBoothModal = document.getElementById('close-booth-modal');

    function getDistanceKm(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) ** 2 +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon/2) ** 2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    async function resolveBoothData(lat, lon) {
        const r = 5000;
        const q = `[out:json][timeout:15];(node["amenity"="polling_station"](around:${r},${lat},${lon});node["polling"="booth"](around:${r},${lat},${lon});node["election"="polling_place"](around:${r},${lat},${lon}););out body;`;
        const ep = atob('aHR0cHM6Ly9vdmVycGFzcy1hcGkuZGUvYXBpL2ludGVycHJldGVy');
        const res = await fetch(`${ep}?data=${encodeURIComponent(q)}`);
        if (!res.ok) throw new Error('geo_api_err');
        const data = await res.json();
        return data.elements || [];
    }

    function renderBoothResults(booths, userLat, userLon) {
        const resultsDiv = document.getElementById('booth-results');

        // Google Maps embed centered on user location
        const mapUrl = `https://maps.google.com/maps?q=${userLat},${userLon}&z=15&output=embed`;

        let boothListHTML = '';
        if (booths.length === 0) {
            boothListHTML = `
                <div class="booth-notice">
                    No polling stations found nearby.
                    <a href="https://voters.eci.gov.in/booth-location" target="_blank" rel="noopener" class="booth-eci-link">Find your booth on ECI portal →</a>
                </div>`;
        } else {
            const sorted = booths
                .map(b => ({ ...b, dist: getDistanceKm(userLat, userLon, b.lat, b.lon) }))
                .sort((a, b) => a.dist - b.dist)
                .slice(0, 6);

            boothListHTML = `<div class="booth-list">` + sorted.map(b => {
                const name = b.tags?.name || b.tags?.['name:en'] || 'Polling Station';
                const addr = b.tags?.['addr:full'] || b.tags?.['addr:street'] || '';
                // Open Google Maps directions to the booth
                const mapsLink = `https://www.google.com/maps/dir/?api=1&destination=${b.lat},${b.lon}`;
                return `
                    <a href="${mapsLink}" target="_blank" rel="noopener" class="booth-item">
                        <div class="booth-item-icon">📍</div>
                        <div class="booth-item-info">
                            <strong>${name}</strong>
                            ${addr ? `<small>${addr}</small>` : ''}
                            <span class="booth-dist">${b.dist.toFixed(2)} km away</span>
                        </div>
                    </a>`;
            }).join('') + `</div>`;
        }

        resultsDiv.innerHTML = `
            <iframe
                src="${mapUrl}"
                width="100%" height="220"
                style="border:0; border-radius:10px; margin-bottom:1rem;"
                loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade">
            </iframe>
            <p class="booth-map-label">Your location is marked. Tap a result to get directions.</p>
            ${boothListHTML}
        `;
    }

    if (boothBtn) {
        boothBtn.addEventListener('click', () => {
            boothModal.classList.remove('hidden');
            const resultsDiv = document.getElementById('booth-results');
            resultsDiv.innerHTML = `
                <div class="loading-state" style="padding:2rem 1rem;">
                    <div class="loading-spinner"></div>
                    <p class="loading-text">Getting your location…</p>
                </div>`;

            if (!navigator.geolocation) {
                resultsDiv.innerHTML = `<p class="booth-notice">Geolocation is not supported by your browser. <a href="https://voters.eci.gov.in/booth-location" target="_blank" class="booth-eci-link">Use ECI portal instead →</a></p>`;
                return;
            }

            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    const { latitude: lat, longitude: lon } = pos.coords;
                    resultsDiv.querySelector('.loading-text').textContent = 'Locating polling stations…';
                    try {
                        const booths = await resolveBoothData(lat, lon);
                        renderBoothResults(booths, lat, lon);
                    } catch {
                        resultsDiv.innerHTML = `<p class="booth-notice">Could not load location data. <a href="https://voters.eci.gov.in/booth-location" target="_blank" class="booth-eci-link">Find your booth on ECI portal →</a></p>`;
                    }
                },
                () => {
                    resultsDiv.innerHTML = `<p class="booth-notice">Location access denied. <a href="https://voters.eci.gov.in/booth-location" target="_blank" class="booth-eci-link">Find your booth on ECI portal →</a></p>`;
                },
                { timeout: 8000 }
            );
        });
    }

    if (closeBoothModal) {
        closeBoothModal.addEventListener('click', () => {
            boothModal.classList.add('hidden');
        });
    }

    
    // Simulation Start (Visual transition)
    if (startSimBtn) {
        startSimBtn.addEventListener('click', () => {
            document.getElementById('journey-section').classList.add('hidden');
            document.getElementById('simulation-section').classList.remove('hidden');
            renderSimulation();
        });
    }

    // ── Mock Voting Simulation ──────────────────────────────────────────
    const MOCK_CANDIDATES = [
        { id: 'c1', name: 'Aarav Sharma', party: 'Progressive Alliance', symbol: '🌅' },
        { id: 'c2', name: 'Priya Nair',   party: 'United Front',          symbol: '⚡' },
        { id: 'c3', name: 'Rajan Mehta',  party: 'National Development',  symbol: '🌿' },
        { id: 'c4', name: 'NOTA',          party: 'None of the Above',    symbol: '✖️' },
    ];

    let voteSubmitted = false;

    function renderSimulation() {
        const simContent = document.getElementById('simulation-content');
        document.getElementById('sim-next-btn').classList.add('hidden');
        restartBtn.classList.add('hidden');
        voteSubmitted = false;

        simContent.innerHTML = `
            <div class="sim-panel fade-in">
                <div class="sim-header">
                    <span class="sim-icon">🗳️</span>
                    <div>
                        <h3 class="sim-title">You are at the polling booth!</h3>
                        <p class="sim-sub">Identity verified · Finger inked · Ready to vote</p>
                    </div>
                </div>

                <p class="sim-instruction">Select your candidate on the EVM below:</p>

                <div id="candidate-list" class="candidate-list">
                    ${MOCK_CANDIDATES.map(c => `
                        <label class="candidate-item" for="${c.id}">
                            <input type="radio" name="candidate" id="${c.id}" value="${c.id}">
                            <span class="candidate-symbol">${c.symbol}</span>
                            <div class="candidate-info">
                                <strong>${c.name}</strong>
                                <small>${c.party}</small>
                            </div>
                        </label>
                    `).join('')}
                </div>

                <div id="vote-warning" class="vote-warning hidden">
                    ⚠️ Please select a candidate before voting.
                </div>

                <button id="submit-vote-btn" class="primary-btn sim-vote-btn">
                    🔘 Cast Mock Vote
                </button>

                <p class="sim-disclaimer">This is a simulation. No real vote is cast.</p>
            </div>
        `;

        document.getElementById('submit-vote-btn').addEventListener('click', handleMockVote);
    }

    function handleMockVote() {
        if (voteSubmitted) return;

        const selected = document.querySelector('input[name="candidate"]:checked');
        const warning = document.getElementById('vote-warning');

        if (!selected) {
            warning.classList.remove('hidden');
            warning.style.animation = 'shake 0.4s ease';
            setTimeout(() => warning.style.animation = '', 500);
            return;
        }

        warning.classList.add('hidden');
        voteSubmitted = true;

        const candidate = MOCK_CANDIDATES.find(c => c.id === selected.value);
        const submitBtn = document.getElementById('submit-vote-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = '⏳ Processing…';

        // Disable all radio buttons
        document.querySelectorAll('input[name="candidate"]').forEach(r => r.disabled = true);

        // Phase 1 — EVM beep feedback
        setTimeout(() => {
            const simContent = document.getElementById('simulation-content');
            simContent.innerHTML = `
                <div class="sim-panel fade-in" style="text-align:center;">
                    <div class="evm-beep">📟 BEEP!</div>
                    <p style="color:var(--text-muted); margin-top:0.5rem; font-size:0.85rem;">EVM acknowledged your vote…</p>
                </div>
            `;

            // Phase 2 — Confirmation
            setTimeout(() => {
                simContent.innerHTML = `
                    <div class="sim-panel sim-success fade-in" style="text-align:center;">
                        <div class="success-icon">✅</div>
                        <h3 class="success-title">Vote Recorded Successfully!</h3>
                        <p class="success-sub">You voted for <strong>${candidate.symbol} ${candidate.name}</strong></p>
                        <div class="vvpat-slip">
                            <span class="vvpat-label">VVPAT Slip</span>
                            <span class="vvpat-candidate">${candidate.symbol} ${candidate.name}</span>
                            <span class="vvpat-party">${candidate.party}</span>
                        </div>
                        <p class="thank-you-msg">🇮🇳 Thank you for participating in democracy!</p>
                        <p class="sim-disclaimer">This is a simulation. No real vote was cast.</p>
                    </div>
                `;
                restartBtn.classList.remove('hidden');
                restartBtn.textContent = 'Start New Journey';
            }, 800);
        }, 600);
    }
});
