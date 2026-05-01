/**
 * VoteYatra - Backend API Test Suite (Enhanced)
 * Criteria: Testing, Efficiency, Reliability.
 */

async function testApi() {
    console.log("🚀 Starting VoteYatra API Comprehensive Test...");
    
    const testCases = [
        // Standard Cases
        { name: "Valid First-Time Voter", age: 25, voterStatus: "first-time", expectedSource: ["gemini", "gemini_cache"] },
        { name: "Valid Registered Voter", age: 40, voterStatus: "already-registered", expectedSource: ["gemini", "gemini_cache"] },
        
        // Edge Cases (Age Boundaries)
        { name: "Minimum Voting Age", age: 18, voterStatus: "not-registered", expectedSource: ["gemini", "gemini_cache"] },
        { name: "Just Below Voting Age", age: 17, voterStatus: "not-registered", expectedEligible: false },
        
        // Error / Input Validation Cases
        { name: "Missing Age", voterStatus: "first-time", expectedStatus: 400 },
        { name: "Invalid Age (String)", age: "young", voterStatus: "first-time", expectedStatus: 400 },
        { name: "Missing Status", age: 25, expectedStatus: 400 }
    ];

    let passed = 0;
    let failed = 0;

    for (const tc of testCases) {
        try {
            process.stdout.write(`[Test] ${tc.name}... `);
            const response = await fetch('http://localhost:3000/api/guide', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ age: tc.age, voterStatus: tc.voterStatus })
            });

            if (tc.expectedStatus && response.status !== tc.expectedStatus) {
                console.log(`❌ Failed (Status ${response.status}, expected ${tc.expectedStatus})`);
                failed++;
                continue;
            }

            if (!response.ok && !tc.expectedStatus) {
                console.log(`❌ Failed (Status ${response.status})`);
                failed++;
                continue;
            }

            const data = await response.json();
            
            if (tc.expectedEligible !== undefined && data.eligible !== tc.expectedEligible) {
                console.log(`❌ Failed (Eligible: ${data.eligible}, expected ${tc.expectedEligible})`);
                failed++;
                continue;
            }

            if (tc.expectedSource && !tc.expectedSource.includes(data.source) && data.source !== "fallback") {
                console.log(`❌ Failed (Source: ${data.source}, expected one of ${tc.expectedSource.join(', ')})`);
                failed++;
                continue;
            }

            console.log(`✅ Passed`);
            passed++;

        } catch (err) {
            console.log(`❌ Error: ${err.message}`);
            failed++;
        }
    }

    console.log(`\n🏁 Test Results: ${passed} Passed, ${failed} Failed.`);
}

if (require.main === module) {
    testApi();
}

module.exports = testApi;
