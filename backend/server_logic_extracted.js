/**
 * Core Logic extracted for testing and better code quality.
 */

function validateInput(age, voterStatus) {
    if (age === undefined || age === null || isNaN(age)) {
        return { isValid: false, error: "A valid numeric age is required." };
    }
    if (!voterStatus || typeof voterStatus !== 'string') {
        return { isValid: false, error: "Voter status must be provided as a string." };
    }
    return { isValid: true };
}

function determineUserType(age, voterStatus) {
    if (age < 18) {
        return {
            type: "ineligible",
            eligible: false,
            reason: "Under legal voting age of 18 in India."
        };
    }

    let type, reason;
    switch (voterStatus) {
        case 'first-time':
            type = "new_voter";
            reason = "18+ and voting for the first time.";
            break;
        case 'not-registered':
            type = "unregistered_voter";
            reason = "Eligible but not yet on the electoral roll.";
            break;
        case 'already-registered':
            type = "ready_voter";
            reason = "Registered and ready for polling day.";
            break;
        default:
            type = "standard_voter";
            reason = "General voting eligibility confirmed.";
    }

    return { type, reason, eligible: true };
}

module.exports = { validateInput, determineUserType };
