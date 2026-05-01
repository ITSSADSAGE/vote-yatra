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

app.post('/api/guide', async (req, res) => {
    const { age, voterStatus } = req.body;

    if (!age || !voterStatus) {
        return res.status(400).json({ error: "Age and voter status are required." });
    }

    if (age < 18) {
        return res.json({ 
            eligible: false,
            message: "In India, you must be 18 or older to vote. Use this time to learn about candidates and issues!" 
        });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

        let guideData;
        try {
            guideData = JSON.parse(text);
            if (!guideData.steps || !Array.isArray(guideData.steps)) throw new Error("Invalid format");
        } catch (parseError) {
            console.warn("AI parsing failed, using fallback steps.");
            guideData = { steps: FALLBACK_STEPS };
        }

        res.json({
            eligible: true,
            persona: voterStatus,
            steps: guideData.steps
        });

    } catch (error) {
        console.error("Critical Backend Error:", error);
        res.json({
            eligible: true,
            persona: voterStatus,
            steps: FALLBACK_STEPS,
            warning: "Note: Displaying standard guide due to service interruption."
        });
    }
});

app.listen(PORT, () => {
    console.log(`VoteYatra Backend running on http://localhost:${PORT}`);
});
