// Native fetch in Node 18+

const BASE_URL = 'http://localhost:5000/api';

async function runTest() {
    try {
        console.log('🚀 Starting Integration Test...');

        // 1. Register Donor
        const donorData = {
            donorId: `DN-TEST-${Math.floor(Math.random() * 10000)}`,
            age: 35,
            weight: 75,
            height: 175,
            BMI: 24.5,
            bloodType: 'O+',
            organDonated: 'LIVER',
            realTimeOrganHealthScore: 95,
            organConditionAlert: 'None',
            hospitalLocation: 'Test Hospital',
            preservationStart: new Date().toISOString()
        };

        console.log(`\n1️⃣ Registering Donor...`);
        const donorRes = await fetch(`${BASE_URL}/donors`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(donorData)
        });
        const donorJson = await donorRes.json();
        console.log('Donor Response:', donorJson);
        console.log('✅ Donor Registered:', donorJson.donorId);

        // 2. Register Recipient
        const recipientData = {
            patientId: `PAT-TEST-${Math.floor(Math.random() * 10000)}`,
            age: 45,
            weight: 80,
            height: 170,
            BMI: 27.7,
            bloodType: 'O+',
            organRequired: 'LIVER',
            diagnosisResult: 'Liver Failure',
            biologicalMarkers: 0.8,
            riskScore: 50,
            organStatus: 'Waiting'
        };

        console.log(`\n2️⃣ Registering Recipient...`);
        const recipRes = await fetch(`${BASE_URL}/recipients`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(recipientData)
        });
        const recipJson = await recipRes.json();
        console.log('Recipient Response:', recipJson);
        console.log('✅ Recipient Registered:', recipJson.patientId);

        // 3. Trigger Allocation
        console.log(`\n3️⃣ Triggering Allocation...`);
        const allocRes = await fetch(`${BASE_URL}/allocation/trigger`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        const allocJson = await allocRes.json();
        if (allocJson && allocJson.recipientHash) {
            console.log('✅ Allocation Successful!');
            console.log('MATCH:', allocJson);
        } else {
            console.log('⚠️ Allocation triggered but no match found (or error). Response:', allocJson);
        }

    } catch (err) {
        console.error('❌ Test Failed:', err);
    }
}

runTest();
