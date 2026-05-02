const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const fetch = globalThis.fetch || require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * 🚀 EFFICIENCY & PERFORMANCE
 * Simple In-Memory Cache to optimize API usage and reduce latency.
 */
const responseCache = new Map();

/**
 * 🛡️ SECURITY & RELIABILITY
 * Simple in-memory rate limiter to prevent API abuse.
 */
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

function checkRateLimit(ip) {
    const now = Date.now();
    const userRequests = rateLimitMap.get(ip) || [];
    const recentRequests = userRequests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);
    
    if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
        return false;
    }
    
    recentRequests.push(now);
    rateLimitMap.set(ip, recentRequests);
    return true;
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Manual Security Headers (Improving Security Score)
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
});

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
    try {
        const text = data?.candidates?.[0]?.content?.parts
            ?.map(part => part?.text || '')
            .filter(Boolean)
            .join('')
            .trim();
        if (!text || typeof text !== 'string') return null;

        const jsonMatch = text.match(/```json\s*([\s\S]*?)```/i);
        const jsonText = jsonMatch ? jsonMatch[1] : text;
        return JSON.parse(jsonText.trim());
    } catch (error) {
        console.error("[Parser Error] Failed to parse Gemini JSON:", error.message);
        return null;
    }
}

async function readGeminiResponse(response) {
    const rawText = await response.text();

    if (!rawText) {
        return { rawText: "", data: null };
    }

    try {
        return { rawText, data: JSON.parse(rawText) };
    } catch {
        return { rawText, data: null };
    }
}

/**
 * 3. Generate Guide (Google Services Integration)
 * Calls Google Gemini API (2.5 Flash) to create a personalized voting journey.
 */
const API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

const LANGUAGE_NAMES = {
    en: "English",
    hi: "Hindi",
    mr: "Marathi",
    bn: "Bengali",
    te: "Telugu"
};


// Heuristic: detect if response looks like English when non-English was requested
function looksEnglish(steps) {
    const COMMON_EN = ['the', 'your', 'you', 'and', 'to', 'is', 'are', 'for', 'of', 'in', 'on', 'at', 'with'];
    const sample = steps.slice(0, 2).map(s => (s.title || '') + ' ' + (s.description || '')).join(' ').toLowerCase();
    const hits = COMMON_EN.filter(w => new RegExp('\\b' + w + '\\b').test(sample)).length;
    return hits >= 4;
}

async function generateGuide(age, voterStatus, geminiKey, language = 'en') {
    const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash"];
    const languageName = LANGUAGE_NAMES[language] || "English";
    let lastError = null;

    // Check cache BEFORE attempting any API call
    const cacheKey = `${voterStatus}-${language}`;
    if (responseCache.has(cacheKey)) {
        console.log(`[Cache] HIT for key: ${cacheKey} — skipping Gemini call`);
        return { steps: responseCache.get(cacheKey), source: "cache" };
    }

    for (const modelName of modelsToTry) {
        try {
            console.log(`[Google Services] Requesting ${modelName} for Persona: ${voterStatus}`);
            
            const response = await fetch(`${API_BASE_URL}/${modelName}:generateContent?key=${geminiKey}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    systemInstruction: {
                        parts: [{ text: language !== 'en'
                            ? 'You MUST write ALL output entirely in ' + languageName + '. Every title, description, insight, action and tip must be in ' + languageName + ' only. Never use English words or sentences.'
                            : 'You are a civic assistant for Indian voters. Respond in English only.' }]
                    },
                    contents: [{
                        parts: [{
                            text: `Generate a practical 4-step voting journey for an Indian voter.

User Context:
- Age: ${age}
- Voter Status: ${voterStatus}
- Response Language: ${languageName}

Rules:
1. 'not-registered' -> Step 1 MUST be registering via Form 6 on voters.eci.gov.in.
2. 'first-time' -> User IS registered. Do NOT mention Form 6. Focus on booth experience, EVM/VVPAT, valid ID.
3. 'already-registered' -> Focus on verification and polling day readiness.

Respond ONLY with this JSON (no markdown wrapper):
{"steps":[{"title":"","description":"","insight":"","action":"","tip":""}]}`
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.2,
                        topP: 0.8,
                        topK: 40,
                        responseMimeType: "application/json"
                    }
                })
            });

            const { rawText, data } = await readGeminiResponse(response);

            if (!response.ok) {
                console.error(`[Google Services] ${modelName} HTTP ${response.status} ${response.statusText}`);
                console.error(`[Google Services] ${modelName} raw response: ${rawText || "<empty>"}`);
                throw new Error(data?.error?.message || rawText || `API Error ${response.status}`);
            }

            if (!data) {
                console.error(`[Google Services] ${modelName} returned non-JSON response: ${rawText || "<empty>"}`);
                throw new Error("Gemini returned a non-JSON response");
            }

            const parsedData = parseGeminiJsonResponse(data);
            const steps = Array.isArray(parsedData) ? parsedData : parsedData?.steps;
            if (!Array.isArray(steps)) {
                console.error(`[Google Services] ${modelName} response payload: ${rawText || "<empty>"}`);
                throw new Error("Invalid Gemini response format");
            }

            // Reject English responses when non-English was requested
            if (language !== 'en' && looksEnglish(steps)) {
                console.warn('[Language] Response returned English for lang=' + language + ' — rejecting, not caching');
                throw new Error('Response language mismatch: expected ' + languageName);
            }
            // Success: cache and return
            responseCache.set(cacheKey, steps);
            console.log('[Cache] SET for key: ' + cacheKey);
            return { steps, source: 'gemini' };

        } catch (error) {
            lastError = error;
            console.warn(`[Google Services] ${modelName} failed: ${error.message}`);
        }
    }

    console.error("All AI Channels Failed. Triggering ECI Fallback.");
    return { steps: getFallbackGuide(voterStatus), source: "eci" };
}

/**
 * 4. Get Fallback Guide (Reliability Layer)
 */
function getFallbackGuide(status) {
    if (status === 'not-registered') {
        return [
            { 
                title: "Register as a Voter (Form 6)", 
                description: "The first step is to apply for registration on the official ECI portal.", 
                insight: "Registration is the primary eligibility gate for all Indian citizens.",
                action: "Visit voters.eci.gov.in and fill Form 6.",
                tip: "Keep address proof and age proof ready." 
            },
            { 
                title: "Track Application Status", 
                description: "Use your reference ID to monitor your application progress.", 
                insight: "Verification ensures your name reaches the final roll.",
                action: "Check status on Voter Helpline App",
                tip: "Registration usually takes 2-4 weeks." 
            },
            { 
                title: "Verify Name in Roll", 
                description: "Once approved, ensure your name appears in the Electoral Roll.", 
                insight: "Your name on the roll is your legal permit to vote.",
                action: "Search name on voters.eci.gov.in",
                tip: "Download your e-EPIC card once registered." 
            },
            { 
                title: "Locate Your Booth", 
                description: "Identify your assigned polling station for election day.", 
                insight: "Booth location prevents last-minute hurdles.",
                action: "Locate booth via Voter Helpline App",
                tip: "Note down your Serial Number for easier check-in." 
            }
        ];
    }

    return [
        { 
            title: "Verify Your Name in Roll", 
            description: "Confirm your presence in the current Electoral Roll on the ECI portal.", 
            insight: "Eligibility depends entirely on being in the constituency roll.",
            action: "Visit voters.eci.gov.in",
            tip: "Use your EPIC number for an accurate search." 
        },
        { 
            title: "Find Your Polling Station", 
            description: "Locate your assigned booth and Part number.", 
            insight: "Advanced knowledge prevents booth-day confusion.",
            action: "Check Voter Helpline App",
            tip: "Download your digital voter slip if available." 
        },
        { 
            title: "Prepare Identity Proof", 
            description: "Carry your physical Voter ID or an approved alternative (Aadhaar, PAN).", 
            insight: "ID verification is mandatory at the polling booth entrance.",
            action: "Keep original ID ready for verification.",
            tip: "Aadhaar is the most widely accepted alternative." 
        },
        { 
            title: "Cast Your Vote on EVM", 
            description: "Enter the booth and press the button for your candidate on the EVM.", 
            insight: "Verify your vote by watching the VVPAT slip for 7 seconds.",
            action: "Research local candidates before going to the booth.",
            tip: "Look for the green light and listen for the long beep." 
        }
    ];
}

// --- MAIN API ROUTE ---

app.post('/api/guide', async (req, res) => {
    try {
        const ip = req.ip || req.headers['x-forwarded-for'];
        const { age, voterStatus, language } = req.body;
        
        console.log(`[Request] Incoming: Age=${age}, Status=${voterStatus} from IP: ${ip}`);

        // Rate Limiting
        if (!checkRateLimit(ip)) {
            console.warn(`[Security] Rate limit exceeded for IP: ${ip}`);
            return res.status(429).json({ error: "Too many requests. Please try again in a minute." });
        }

        // Step 1: Validate Input
        const validation = validateInput(age, voterStatus);
        if (!validation.isValid) {
            console.warn(`[Validation] Invalid input: ${validation.error}`);
            return res.status(400).json({ error: validation.error });
        }

        // Step 2: Determine User Context
        const userContext = determineUserType(age, voterStatus);
        console.log(`[Logic] User Classified as: ${userContext.type}`);
        
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
            console.error("[System] Missing GEMINI_API_KEY. Defaulting to verified ECI logic.");
            return res.status(500).json({
                eligible: true,
                user_type: userContext.type,
                source: "fallback",
                steps: getFallbackGuide(voterStatus),
                error: "Missing API Configuration"
            });
        }

        // Step 3: Generate Guide with Hybrid Handling
        const { steps, source } = await generateGuide(age, voterStatus, geminiKey, language || 'en');
        console.log(`[Response] Guide generated via: ${String(source).startsWith('gemini') ? 'Google Gemini AI' : 'Verified ECI Logic'}`);

        res.json({
            eligible: true,
            user_type: userContext.type,
            source: source,
            steps: steps
        });

    } catch (error) {
        console.error("[Internal Error]", error);
        res.status(500).json({
            eligible: false,
            user_type: "error",
            source: "fallback",
            steps: [],
            error: "An unexpected error occurred. Please try again."
        });
    }
});

app.listen(PORT, () => {
    console.log(`VoteYatra Backend running on http://localhost:${PORT}`);
    console.log(`[Cache] Ready. Responses will be cached in-memory for this session.`);
});
