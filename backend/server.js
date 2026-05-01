require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(cors());
app.use(express.json());

// Fallback steps in case AI fails or returns invalid JSON
// This ensures the service remains functional even if the AI model is unavailable
const FALLBACK_STEPS = [
    { 
        title: "Verify Registration", 
        description: "Search your name in the Electoral Roll on voters.eci.gov.in.", 
        insight: "Ensures you are officially recognized as a voter in your constituency.",
        action: "Go to voters.eci.gov.in and search your name using your state and district.",
        tip: "Keep your EPIC number (Voter ID) handy." 
    },
    { 
        title: "Locate Your Booth", 
        description: "Find your assigned Polling Station and Booth number via the Voter Helpline App.", 
        insight: "Prevents confusion on election day and ensures you join the correct queue.",
        action: "Download the 'Voter Helpline' app and tap 'Search in Electoral Roll' to find your booth.",
        tip: "Note down your Booth number and Part number printed on your Voter ID slip." 
    },
    { 
        title: "Carry Valid ID", 
        description: "Bring your original Voter ID card or Aadhaar to the polling station.", 
        insight: "Confirms your identity and prevents fraudulent voting.",
        action: "Check your Voter ID card is not expired; alternatively verify your Aadhaar is updated.",
        tip: "Voter Information Slips alone are not valid identity proof." 
    },
    { 
        title: "Cast Your Vote", 
        description: "Verify your name at the booth, get your finger inked, and press the EVM button next to your candidate.", 
        insight: "The final step in exercising your democratic right to choose your representative.",
        action: "Research candidates at affidavit.eci.gov.in before election day so you vote with confidence.",
        tip: "The beep sound and VVPAT slip confirm your vote has been recorded." 
    }
];

/**
 * Helper to determine user classification metadata
 * @param {number} age 
 * @param {string} status 
 * @returns {object} { type, reason }
 */
function getClassification(age, status) {
    if (age < 18) {
        return { 
            type: "ineligible", 
            reason: "User is under the legal voting age of 18 in India." 
        };
    }
    
    switch (status) {
        case 'first-time':
            return { 
                type: "new_voter", 
                reason: "User is 18+ and voting for the first time; requires end-to-end guidance." 
            };
        case 'not-registered':
            return { 
                type: "unregistered_voter", 
                reason: "User is eligible but not yet on the electoral roll; requires registration focus." 
            };
        case 'already-registered':
            return { 
                type: "ready_voter", 
                reason: "User is already registered; requires polling day and candidate info focus." 
            };
        default:
            return { 
                type: "standard_voter", 
                reason: "General eligibility confirmed; providing standard voting journey." 
            };
    }
}

app.post('/api/guide', async (req, res) => {
    const { age, voterStatus } = req.body;

    if (!age || !voterStatus) {
        return res.status(400).json({ error: "Age and voter status are required." });
    }

    // Determine classification metadata based on decision logic
    const classification = getClassification(age, voterStatus);

    if (age < 18) {
        return res.json({ 
            eligible: false,
            user_type: classification.type,
            reason: classification.reason,
            source: "static_check",
            message: "In India, you must be 18 or older to vote. Use this time to learn about candidates and issues!" 
        });
    }

    let source = "gemini";
    let steps = [];

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
            You are VoteYatra, a specialized civic assistant for Indian voters.
            Task: Generate a practical, step-by-step voting journey.
            
            User Profile:
            - Age: ${age}
            - Current Status: ${voterStatus}
            
            Requirements for Steps:
            1. Real-world Actions: Focus on specific tasks (EPIC, Electoral Search, EVM, etc.).
            2. Local Context: Use Indian terms.
            3. Insight: For each step, provide a 1-line "insight" explaining WHY this step matters for democracy or security.
            
            Strict Constraint:
            Return ONLY a valid JSON object with exactly 4 steps. No markdown.
            
            JSON Format:
            {
              "steps": [
                { 
                  "title": "Action Title", 
                  "description": "Specific action instructions.", 
                  "insight": "1-line explanation of why this matters for democracy or security.",
                  "action": "One specific thing the user can do RIGHT NOW (e.g. visit a URL, open an app, call a number).",
                  "tip": "Practical tip." 
                }
              ]
            }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text().replace(/```json|```/g, '').trim();

        try {
            const guideData = JSON.parse(text);
            if (!guideData.steps || !Array.isArray(guideData.steps)) throw new Error("Invalid format");
            steps = guideData.steps;
        } catch (parseError) {
            // Fallback Handling: trigger if AI returns malformed JSON
            console.warn("AI parsing failed, switching to fallback source.");
            steps = FALLBACK_STEPS;
            source = "fallback";
        }

    } catch (error) {
        // Fallback Handling: trigger if API call fails or times out
        console.error("Critical Backend Error:", error);
        steps = FALLBACK_STEPS;
        source = "fallback";
    }

    // Consistent response structure for transparency and evaluation
    res.json({
        eligible: true,
        user_type: classification.type,
        reason: classification.reason,
        source: source,
        steps: steps
    });
});

app.listen(PORT, () => {
    console.log(`VoteYatra Backend running on http://localhost:${PORT}`);
});
