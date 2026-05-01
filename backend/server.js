require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fetch = globalThis.fetch || require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Note: SDK is bypassed for Direct API Connection to ensure compatibility with Gemini 2 Flash.

// Efficiency: Simple In-Memory Cache to optimize API usage
const responseCache = new Map();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Root Route - Serves Frontend
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// --- REFACTORED LOGIC FUNCTIONS ---

/**
 * 1. Validate Input
 * Ensures age and status are provided and logically sound.
 */
function validateInput(age, voterStatus) {
    // Check if age is present and is a valid number
    if (age === undefined || age === null || isNaN(age)) {
        return { isValid: false, error: "A valid numeric age is required." };
    }

    // Check if voterStatus is provided
    if (!voterStatus || typeof voterStatus !== 'string') {
        return { isValid: false, error: "Voter status must be provided as a string." };
    }

    return { isValid: true };
}

/**
 * 2. Determine User Type
 * Classifies users based on their eligibility and context.
 */
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

function getGeminiApiKey() {
    const key = process.env.GEMINI_API_KEY;
    return key && typeof key === 'string' && key.trim().length > 0 ? key.trim() : null;
}

function parseGeminiJsonResponse(data) {
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text || typeof text !== 'string') {
        return null;
    }

    const jsonMatch = text.match(/```json\s*([\s\S]*?)```/i);
    const jsonText = jsonMatch ? jsonMatch[1] : text;
    const cleanedText = jsonText.trim();

    try {
        return JSON.parse(cleanedText);
    } catch (error) {
        return null;
    }
}

/**
 * 3. Generate Guide
 * Calls Google Gemini API to create a personalized voting journey.
 */
// Direct API Connection (Bypassing broken SDK for maximum reliability)
const API_BASE_URL = "https://generativelanguage.googleapis.com/v1/models";

async function generateGuide(age, voterStatus, geminiKey) {
    const modelsToTry = ["gemini-2.0-flash", "gemini-1.5-flash"];
    let lastError = null;

    for (const modelName of modelsToTry) {
        try {
            const cacheKey = `${age}-${voterStatus}`;
            if (responseCache.has(cacheKey)) {
                return { steps: responseCache.get(cacheKey), source: "gemini_cache" };
            }

            console.log(`[Direct AI] Requesting ${modelName}...`);
            
            const response = await fetch(`${API_BASE_URL}/${modelName}:generateContent?key=${geminiKey}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `
                                You are VoteYatra, a specialized civic assistant for Indian voters.
                                Task: Generate a practical, 4-step voting journey for an Indian voter.
                                User: Age ${age}, Status ${voterStatus}.
                                Rules: ${voterStatus === 'not-registered' ? 'Step 1 MUST be Register (Form 6).' : ''}
                                JSON Format Only: { "steps": [{ "title": "T", "description": "D", "insight": "I", "action": "A", "tip": "T" }] }
                            `
                        }]
                    }],
                    generationConfig: { temperature: 0.7, topP: 0.8, topK: 40 }
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || `API Error ${response.status}`);
            }

            const parsedData = parseGeminiJsonResponse(data);
            if (!parsedData || !Array.isArray(parsedData.steps)) {
                throw new Error("Invalid Gemini response format");
            }

            // Success: Cache and return
            responseCache.set(cacheKey, parsedData.steps);
            return { steps: parsedData.steps, source: `gemini_${modelName.split('-')[1]}` };

        } catch (error) {
            lastError = error;
            console.warn(`[Direct AI] ${modelName} failed: ${error.message}`);
        }
    }

    console.error("All Direct AI Channels Failed. Triggering ECI Fallback.");
    return { steps: getFallbackGuide(voterStatus), source: "fallback" };
}

/**
 * 4. Get Fallback Guide
 * Returns a static, reliable guide if the AI is unavailable, times out, or returns invalid data.
 * This is a CRITICAL reliability layer that ensures the service never fails to provide 
 * accurate Election Commission of India (ECI) process information to the user.
 */
function getFallbackGuide(status) {
    // Specialized steps for users not yet on the Electoral Roll
    if (status === 'not-registered') {
        return [
            { 
                title: "Register as a Voter (Form 6)", 
                description: "The first and most critical step is to apply for registration on the official ECI portal.", 
                insight: "Without registration, you cannot cast a vote even if you have an ID card.",
                action: "Go to voters.eci.gov.in and fill Form 6.",
                tip: "Keep a digital copy of your age and address proof ready." 
            },
            { 
                title: "Track Application Status", 
                description: "Once submitted, use your reference ID to track the progress of your application.", 
                insight: "Ensures that any discrepancies are fixed before the electoral roll is finalized.",
                action: "Check status on the Voter Helpline App",
                tip: "It usually takes 2-4 weeks for the BLO to verify your application." 
            },
            { 
                title: "Verify Name in Final Roll", 
                description: "After approval, verify that your name correctly appears in the official Electoral Roll.", 
                insight: "Confirmation of your name is the final gatekeeper for voting eligibility.",
                action: "Search name on voters.eci.gov.in",
                tip: "Download your e-EPIC as soon as your name is added." 
            },
            { 
                title: "Find Your Polling Station", 
                description: "Identify your assigned booth for the upcoming election day.", 
                insight: "Knowing your booth location in advance prevents last-minute hurdles.",
                action: "Locate booth via Voter Helpline App",
                tip: "Note down the Serial Number for easy identification at the booth." 
            }
        ];
    }

    // Default steps for already registered voters
    return [
        { 
            title: "Verify Your Name in Electoral Roll", 
            description: "Check if your name is present in the official Electoral Roll on the ECI search portal.", 
            insight: "Legal eligibility to vote depends entirely on your presence in the current constituency roll.",
            action: "Visit voters.eci.gov.in (Official ECI Portal)",
            tip: "Use your EPIC number (Voter ID) for a faster and more accurate search." 
        },
        { 
            title: "Locate Your Polling Station", 
            description: "Find the exact location of your Polling Station and Booth number using the Voter Helpline App.", 
            insight: "Knowing your booth in advance prevents last-minute confusion and saves time on election day.",
            action: "Open Voter Helpline App -> Search in Electoral Roll",
            tip: "Check the Part Number and Serial Number on your Voter ID or digital slip." 
        },
        { 
            title: "Prepare Your Identity Proof", 
            description: "Carry your original EPIC card or one of the 12 alternative IDs approved by the ECI (e.g., Aadhaar, PAN).", 
            insight: "Identity verification is the first step at the booth to prevent impersonation and fraud.",
            action: "Download digital EPIC (e-EPIC) if you don't have the physical card.",
            tip: "Aadhar card is the most common and widely accepted alternative to the physical Voter ID." 
        },
        { 
            title: "Cast Your Vote on EVM/VVPAT", 
            description: "Enter the booth, get your finger inked, and press the blue button on the EVM next to your candidate.", 
            insight: "Your vote is confirmed only after the beep sound and viewing the slip in the VVPAT glass.",
            action: "Research your local candidates on the Know Your Candidate (KYC) app.",
            tip: "The VVPAT slip is visible for 7 seconds—ensure it matches your choice before leaving." 
        }
    ];
}

// --- MAIN API ROUTE ---

app.post('/api/guide', async (req, res) => {
    try {
        const { age, voterStatus } = req.body;
        console.log(`[Request] Incoming: Age=${age}, Status=${voterStatus}`);

        // Step 1: Validate Input
        const validation = validateInput(age, voterStatus);
        if (!validation.isValid) {
            return res.status(400).json({ error: validation.error });
        }

        // Step 2: Determine User Type and Eligibility
        const userContext = determineUserType(age, voterStatus);
        console.log(`[Logic] Classified as: ${userContext.type} (${userContext.reason})`);

        // Immediate exit for ineligible users
        if (!userContext.eligible) {
            return res.json({
                eligible: false,
                user_type: userContext.type,
                reason: userContext.reason,
                source: "fallback",
                steps: [],
                message: "You must be 18+ to vote in India. You can still learn about the process!"
            });
        }

        const geminiKey = getGeminiApiKey();
        if (!geminiKey) {
            console.error("Missing GEMINI_API_KEY. Using fallback guide.");
            return res.status(500).json({
                eligible: true,
                user_type: userContext.type,
                reason: userContext.reason,
                source: "fallback",
                steps: getFallbackGuide(voterStatus),
                error: "Missing GEMINI_API_KEY in backend/.env"
            });
        }

        // Step 3 & 4: Generate Guide with Hybrid Handling
        const { steps, source } = await generateGuide(age, voterStatus, geminiKey);
        console.log(`[Response] Guide generated via: ${source}`);

        // Final Response
        res.json({
            eligible: true,
            user_type: userContext.type,
            reason: userContext.reason,
            source: source,
            steps: steps
        });

    } catch (error) {
        console.error("Internal Server Error:", error);
        res.status(500).json({
            eligible: false,
            user_type: "error",
            source: "fallback",
            steps: getFallbackGuide(voterStatus),
            error: "Something went wrong. Please try again."
        });
    }
});

app.listen(PORT, () => {
    console.log(`VoteYatra Backend running on http://localhost:${PORT}`);
});
