export function initPersona() {
    const personaSection = document.getElementById('persona-section');
    const hero = document.querySelector('.hero');
    
    hero.classList.add('hidden');
    personaSection.classList.remove('hidden');
    
    personaSection.innerHTML = `
        <div class="glass-card">
            <h2>Choose Your Persona</h2>
            <div class="persona-grid">
                <!-- Personas will go here -->
            </div>
        </div>
    `;
    console.log('Persona selection initialized');
}
