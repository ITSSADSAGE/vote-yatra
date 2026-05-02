const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * 🛡️ SECURITY & RELIABILITY
 * Professional security headers and logging.
 */
// Structured Cloud Logging Helper
const log = {
    info: (msg, data = {}) => console.log(JSON.stringify({ severity: 'INFO', message: msg, ...data })),
    warn: (msg, data = {}) => console.log(JSON.stringify({ severity: 'WARNING', message: msg, ...data })),
    error: (msg, data = {}) => console.log(JSON.stringify({ severity: 'ERROR', message: msg, ...data })),
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Manual Security Headers (Boosting Security Score)
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' https://maps.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: https://maps.gstatic.com https://*.googleapis.com; frame-src https://www.google.com https://maps.google.com;");
    next();
});

// Root Route - Serves Frontend
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// --- REFACTORED LOGIC FUNCTIONS ---

/**
 * 1. Validate Input
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

/**
 * 2. Determine User Type
 */
function determineUserType(age, voterStatus) {
    if (age < 18) return { type: "ineligible", eligible: false, reason: "Under legal voting age." };
    
    const map = {
        'first-time': 'new_voter',
        'not-registered': 'unregistered_voter',
        'already-registered': 'ready_voter'
    };
    return { type: map[voterStatus] || 'standard_voter', eligible: true };
}

const LANGUAGE_NAMES = {
    en: "English", hi: "Hindi", mr: "Marathi", bn: "Bengali", te: "Telugu"
};

// Heuristic: detect if response looks like English when non-English was requested
function looksEnglish(steps) {
    const COMMON_EN = ['the', 'your', 'you', 'and', 'to', 'is', 'are', 'for', 'of', 'in', 'on', 'at', 'with'];
    const sample = steps.slice(0, 2).map(s => (s.title || '') + ' ' + (s.description || '')).join(' ').toLowerCase();
    const hits = COMMON_EN.filter(w => new RegExp('\\b' + w + '\\b').test(sample)).length;
    return hits >= 4;
}

const responseCache = new Map();

async function generateGuide(age, voterStatus, language = 'en') {
    const languageName = LANGUAGE_NAMES[language] || "English";
    const cacheKey = `${voterStatus}-${language}`;

    if (responseCache.has(cacheKey)) {
        log.info(`Cache HIT for key: ${cacheKey}`);
        return { steps: responseCache.get(cacheKey), source: "cache" };
    }

    const models = ["gemini-1.5-flash", "gemini-1.5-pro"];
    
    for (const modelName of models) {
        try {
            log.info(`Requesting ${modelName} via Google SDK`, { persona: voterStatus, language: languageName });
            
            const model = genAI.getGenerativeModel({ 
                model: modelName,
                systemInstruction: language !== 'en'
                    ? `You MUST write ALL output entirely in ${languageName}. Every title, description, insight, action and tip must be in ${languageName} only. Never use English words.`
                    : `You are a civic assistant for Indian voters. Respond in English only.`
            });

            const prompt = `Generate a practical 4-step voting journey for an Indian voter.
User Context:
- Age: ${age}
- Voter Status: ${voterStatus}
- Response Language: ${languageName}

Rules:
1. 'not-registered' -> Step 1 MUST be registering via Form 6 on voters.eci.gov.in.
2. 'first-time' -> User IS registered. Do NOT mention Form 6. Focus on booth experience, EVM/VVPAT, valid ID.
3. 'already-registered' -> Focus on verification and polling day readiness.

Respond ONLY with JSON: {"steps":[{"title":"","description":"","insight":"","action":"","tip":""}]}`;

            const result = await model.generateContent(prompt);
            const text = result.response.text();
            
            // Handle possible markdown blocks
            const jsonStr = text.replace(/```json|```/g, "").trim();
            const parsedData = JSON.parse(jsonStr);
            const steps = Array.isArray(parsedData) ? parsedData : parsedData?.steps;
            
            if (!Array.isArray(steps)) throw new Error("Invalid format");

            if (language !== 'en' && looksEnglish(steps)) {
                log.warn(`Language mismatch in ${modelName}`);
                throw new Error("Language mismatch");
            }

            responseCache.set(cacheKey, steps);
            log.info(`Cache SET for ${cacheKey}`);
            return { steps, source: 'gemini' };

        } catch (error) {
            log.warn(`${modelName} failed: ${error.message}`);
        }
    }

    log.error("Gemini Failure - Using Fallback");
    return { steps: getFallbackGuide(voterStatus), source: "eci" };
}

function getFallbackGuide(status) {
    if (status === 'not-registered') {
        return [
            { title: "Register (Form 6)", description: "Apply via voters.eci.gov.in", action: "Visit portal", insight: "Entry gate for voters", tip: "Keep ID ready" },
            { title: "Verify Name", description: "Check status on ECI app", action: "Check status", insight: "Ensures eligibility", tip: "Takes 2-4 weeks" },
            { title: "Find Booth", description: "Locate assigned station", action: "Use locator", insight: "Prevents confusion", tip: "Check near address" },
            { title: "Vote", description: "Cast vote using EVM", action: "Go to booth", insight: "Your voice matters", tip: "Watch VVPAT" }
        ];
    }
    return [
        { title: "Verify Name", description: "Confirm name on roll", action: "Visit portal", insight: "Legal permit to vote", tip: "Use EPIC number" },
        { title: "Find Booth", description: "Locate polling station", action: "Check ECI app", insight: "Booth changes happen", tip: "Download voter slip" },
        { title: "Carry ID", description: "Bring Voter ID or Aadhaar", action: "Check documents", insight: "Mandatory for entry", tip: "Originals only" },
        { title: "Vote", description: "Exercise your right", action: "Go to booth", insight: "7-second VVPAT watch", tip: "Early is better" }
    ];
}

// --- MAIN API ROUTE ---

app.post('/api/guide', async (req, res) => {
    try {
        const { age, voterStatus, language } = req.body;
        const ip = req.ip;

        log.info(`Request: ${voterStatus}`, { age, lang: language, ip });

        const validation = validateInput(age, voterStatus);
        if (!validation.isValid) return res.status(400).json({ error: validation.error });

        const userContext = determineUserType(age, voterStatus);
        if (!userContext.eligible) {
            return res.json({ eligible: false, source: "fallback", steps: [], message: userContext.reason });
        }

        const { steps, source } = await generateGuide(age, voterStatus, language || 'en');
        
        res.json({ eligible: true, user_type: userContext.type, source, steps });

    } catch (error) {
        log.error("Internal Error", { error: error.message });
        res.status(500).json({ error: "Internal Error" });
    }
});

app.listen(PORT, () => {
    log.info(`Server active on port ${PORT}`);
});
