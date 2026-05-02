/**
 * UI Renderer - Strictly Visual
 * Responsible for rendering the journey UI based on provided steps.
 */

const UIRenderer = {
    // DOM Elements
    elements: {
        app: document.getElementById('app'),
        personaSection: document.getElementById('persona-section'),
        journeySection: document.getElementById('journey-section'),
        learningSection: document.getElementById('learning-section'),
        stepsContainer: document.getElementById('steps-container'),
        learningContainer: document.getElementById('learning-container'),
        progressBar: document.getElementById('progress-bar'),
        learningProgressBar: document.getElementById('learning-progress-bar'),
        boothBtn: document.getElementById('find-booth-btn'),
        journeyTitle: document.getElementById('journey-title'),
        prevBtn: document.getElementById('prev-step'),
        nextBtn: document.getElementById('next-step'),
        prevLearningBtn: document.getElementById('prev-learning'),
        nextLearningBtn: document.getElementById('next-learning'),
        startSimBtn: document.getElementById('start-simulation'),
        simulationSection: document.getElementById('simulation-section')
    },

    init: function() {
        this.elements = {
            app: document.getElementById('app'),
            personaSection: document.getElementById('persona-section'),
            journeySection: document.getElementById('journey-section'),
            learningSection: document.getElementById('learning-section'),
            stepsContainer: document.getElementById('steps-container'),
            learningContainer: document.getElementById('learning-container'),
            progressBar: document.getElementById('progress-bar'),
            learningProgressBar: document.getElementById('learning-progress-bar'),
            boothBtn: document.getElementById('find-booth-btn'),
            journeyTitle: document.getElementById('journey-title'),
            prevBtn: document.getElementById('prev-step'),
            nextBtn: document.getElementById('next-step'),
            prevLearningBtn: document.getElementById('prev-learning'),
            nextLearningBtn: document.getElementById('next-learning'),
            startSimBtn: document.getElementById('start-simulation'),
            simulationSection: document.getElementById('simulation-section')
        };
    },

    renderVotingJourney: function(steps, currentIndex) {
        this.init();
        this.elements.app.classList.remove('learning-theme');
        this.elements.personaSection.classList.add('hidden');
        this.elements.learningSection.classList.add('hidden');
        this.elements.simulationSection.classList.add('hidden');
        this.elements.journeySection.classList.remove('hidden');
        
        this.renderStep(this.elements.stepsContainer, steps, currentIndex, false);
        this.updateProgress(this.elements.progressBar, currentIndex, steps.length);
        this.updateButtons(currentIndex, steps.length, true);
    },

    renderLearningJourney: function(steps, currentIndex) {
        this.init();
        this.elements.app.classList.add('learning-theme');
        this.elements.personaSection.classList.add('hidden');
        this.elements.journeySection.classList.add('hidden');
        this.elements.simulationSection.classList.add('hidden');
        this.elements.learningSection.classList.remove('hidden');

        this.renderStep(this.elements.learningContainer, steps, currentIndex, true);
        this.updateProgress(this.elements.learningProgressBar, currentIndex, steps.length);
        this.updateButtons(currentIndex, steps.length, false);
    },

    renderStep: function(container, steps, index, isLearning) {
        if (!container || !steps || steps.length === 0) return;
        
        const step = steps[index];
        const whyMattersLabel = LanguageEngine.getText('why_matters');
        const tipLabel = LanguageEngine.getText('tip_label');
        const stepLabel = isLearning ? LanguageEngine.getText('step_of_total').replace('{n}', index + 1).replace('{total}', steps.length) : `Step ${index + 1}`;

        container.innerHTML = `
            <p class="step-counter">${stepLabel} — ${step.title}</p>
            <div class="step-card fade-in">
                <h3 class="step-title">${step.title}</h3>
                <p class="step-desc">${step.description}</p>
                
                ${step.insight ? `
                <div class="step-insight">
                    <em>${whyMattersLabel}</em>
                    ${step.insight}
                </div>` : ''}
                
                ${step.action ? `
                <div class="step-action">
                    ▶ ${step.action}
                </div>` : ''}
                
                ${step.tip ? `
                <div class="pro-tip">
                    💡 <strong>${tipLabel}</strong> ${step.tip}
                </div>` : ''}
            </div>
        `;
    },

    updateProgress: function(progressBar, index, total) {
        if (progressBar) {
            const progress = ((index + 1) / total) * 100;
            progressBar.style.width = `${progress}%`;
        }
    },

    updateButtons: function(index, total, isVoting) {
        const prev = isVoting ? this.elements.prevBtn : this.elements.prevLearningBtn;
        const next = isVoting ? this.elements.nextBtn : this.elements.nextLearningBtn;
        const startSim = this.elements.startSimBtn;

        if (prev) {
            prev.style.visibility = index === 0 ? 'hidden' : 'visible';
        }

        const nextLabel = LanguageEngine.getText('next_step');

        if (next) {
            next.textContent = nextLabel;
            if (index === total - 1) {
                next.classList.add('hidden');
                if (isVoting && startSim) {
                    startSim.classList.remove('hidden');
                }
            } else {
                next.classList.remove('hidden');
                if (startSim) {
                    startSim.classList.add('hidden');
                }
            }
        }
    },

    showPersonaSection: function() {
        this.init();
        this.elements.app.classList.remove('learning-theme');
        this.elements.journeySection.classList.add('hidden');
        this.elements.learningSection.classList.add('hidden');
        this.elements.simulationSection.classList.add('hidden');
        this.elements.personaSection.classList.remove('hidden');
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIRenderer;
} else {
    window.UIRenderer = UIRenderer;
}
