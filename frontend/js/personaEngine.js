/**
 * Persona Engine - Core Logic
 * Deterministic logic to determine user persona and mode.
 * Constraints: No UI code, No API calls, No AI usage.
 */

const PersonaEngine = {
    determineUser: function(age, status) {
        if (age < 18) {
            return { mode: "learning", persona: "underage" };
        }
        
        if (status === "not-registered") {
            return { mode: "voting", persona: "not-registered" };
        }
        
        if (status === "first-time") {
            return { mode: "voting", persona: "first-time" };
        }
        
        // Default to returning voter if 18+ and not first-time/unregistered
        return { mode: "voting", persona: "returning" };
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PersonaEngine;
} else {
    window.PersonaEngine = PersonaEngine;
}
