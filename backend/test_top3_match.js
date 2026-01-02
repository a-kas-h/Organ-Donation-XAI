// Test script for Top-3 Match Selection endpoints
const BASE_URL = 'http://localhost:5000/api';

async function testTop3MatchFlow() {
    try {
        console.log('🧪 Testing Top-3 Match Selection Flow\n');

        // Step 1: Register multiple donors
        console.log('1️⃣ Registering 5 donors with varying health scores...');
        const donors = [];
        for (let i = 1; i <= 5; i++) {
            const healthScore = 60 + (i * 7); // Scores: 67, 74, 81, 88, 95
            const donorPayload = {
                donorId: `DN-TEST-${Date.now()}-${i}`,
                age: 30 + i,
                weight: 70 + i,
                height: 175,
                BMI: 22 + i * 0.5,
                bloodType: 'A+',
                organDonated: 'KIDNEY',
                realTimeOrganHealthScore: healthScore,
                organConditionAlert: 'None',
                medicalApproval: true
            };

            const res = await fetch(`${BASE_URL}/donors`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(donorPayload)
            });

            if (res.ok) {
                const donor = await res.json();
                donors.push(donor);
                console.log(`   ✅ Donor ${donor.donorId} registered (Health: ${healthScore})`);
            }
        }

        // Step 2: Register a recipient
        console.log('\n2️⃣ Registering recipient...');
        const recipientPayload = {
            patientId: `PAT-TEST-${Date.now()}`,
            age: 45,
            weight: 80,
            height: 170,
            BMI: 27.7,
            bloodType: 'A+',
            organRequired: 'KIDNEY',
            diagnosisResult: 'Requires KIDNEY transplant',
            biologicalMarkers: 0.6,
            organStatus: 'Waiting',
            riskScore: 55
        };

        const recipRes = await fetch(`${BASE_URL}/recipients`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(recipientPayload)
        });

        const recipient = await recipRes.json();
        console.log(`   ✅ Recipient ${recipient.patientId} registered`);

        // Step 3: Find Top 3 Donors
        console.log('\n3️⃣ Finding top 3 donor matches...');
        const findRes = await fetch(`${BASE_URL}/matches/find-top-donors`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ recipientId: recipient.patientId })
        });

        const topMatches = await findRes.json();
        console.log(`   ✅ Found ${topMatches.topMatches?.length || 0} matches:`);

        if (topMatches.topMatches) {
            topMatches.topMatches.forEach((match, idx) => {
                console.log(`   ${idx + 1}. ${match.donorId} - Score: ${match.predictedScore} - Risk: ${match.riskLevel}`);
            });
        }

        // Step 4: Approve the best match
        if (topMatches.topMatches && topMatches.topMatches.length > 0) {
            const bestMatch = topMatches.topMatches[0];
            console.log(`\n4️⃣ Doctor approving best match: ${bestMatch.donorId}...`);

            const approveRes = await fetch(`${BASE_URL}/matches/approve`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    recipientId: recipient.patientId,
                    donorId: bestMatch.donorId,
                    doctorId: 'DR-001',
                    remarks: 'Best match from Top 3 selection'
                })
            });

            if (approveRes.ok) {
                const approvedMatch = await approveRes.json();
                console.log(`   ✅ Match approved! Match ID: ${approvedMatch.match._id}`);
                console.log(`   📊 Final Score: ${approvedMatch.predictedScore}`);
            } else {
                const error = await approveRes.json();
                console.log(`   ❌ Approval failed: ${error.error}`);
            }
        }

        console.log('\n✅ Top-3 Match Flow Test Complete!');

    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

testTop3MatchFlow();
