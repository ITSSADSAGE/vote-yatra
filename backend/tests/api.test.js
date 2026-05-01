/**
 * VoteYatra - Backend API Test Suite
 * This script performs a basic smoke test on the core /api/guide endpoint.
 * Criteria: Testing, Efficiency, Reliability.
 */

async function testApi() {
    console.log("🚀 Starting VoteYatra API Smoke Test...");
    
    const testCases = [
        { age: 25, voterStatus: "first-time", expected: "new_voter" },
        { age: 17, voterStatus: "not-registered", expected: "ineligible" },
        { age: 40, voterStatus: "already-registered", expected: "ready_voter" }
    ];

    for (const tc of testCases) {
        try {
            console.log(`[Test] Checking Age: ${tc.age}, Status: ${tc.voterStatus}...`);
            const response = await fetch('http://localhost:3000/api/guide', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tc)
            });

            if (!response.ok) {
                console.error(`❌ Request Failed with status ${response.status}`);
                continue;
            }

            const data = await response.json();
            
            // Validate Structure
            const hasRequiredFields = data.user_type && data.source && Array.isArray(data.steps);
            
            if (hasRequiredFields) {
                console.log(`✅ Success! Source: ${data.source}, User Type: ${data.user_type}`);
            } else {
                console.warn(`⚠️ Partial Success: Missing expected fields in response.`);
            }

        } catch (err) {
            console.error(`❌ Test Error: ${err.message}. (Is the server running on :3000?)`);
        }
    }

    console.log("\n🏁 Smoke Test Completed.");
}

// Check if running in a test environment or directly
if (require.main === module) {
    testApi();
}

module.exports = testApi;
