const axios = require('axios');

const BACKEND_URL = 'http://localhost:5000/api';

const runVerification = async () => {
    try {
        console.log('--- Starting Verification ---');

        // 1. Create Donor
        console.log('\n1. Creating Donor...');
        const donorRes = await axios.post(`${BACKEND_URL}/donors`, {
            donorId: `DNR${Date.now()}`,
            age: 35,
            weight: 70.5,
            BMI: 24.0,
            bloodType: 'O+',
            organDonated: 'Kidney',
            realTimeOrganHealthScore: 88,
            organConditionAlert: 'None',
            medicalApproval: true
        });
        const donorMongoId = donorRes.data._id;
        console.log('✅ Donor Created:', donorRes.data.donorId);

        // 2. Create Recipient
        console.log('\n2. Creating Recipient...');
        const recipientRes = await axios.post(`${BACKEND_URL}/recipients`, {
            patientId: `PAT${Date.now()}`,
            age: 40,
            weight: 75.0,
            BMI: 25.0,
            bloodType: 'O+',
            organRequired: 'Kidney',
            diagnosisResult: 'Chronic Kidney Disease',
            biologicalMarkers: 5.0,
            riskScore: 2.0
        });
        const recipientMongoId = recipientRes.data._id;
        console.log('✅ Recipient Created:', recipientRes.data.patientId);

        // 3. Generate Match
        console.log('\n3. Generating Match...');
        // Pass Mongo IDs for lookup
        const matchRes = await axios.post(`${BACKEND_URL}/matches/generate`, {
            donorId: donorMongoId,
            recipientId: recipientMongoId
        });
        const matchId = matchRes.data._id;
        console.log('✅ Match Generated:', matchId);
        console.log('   Predicted Survival:', matchRes.data.predictedSurvivalChance);
        console.log('   Status:', matchRes.data.matchStatus);

        // 4. View Pending Matches
        console.log('\n4. Checking Pending Matches...');
        const pendingRes = await axios.get(`${BACKEND_URL}/matches/pending`);
        const pendingMatch = pendingRes.data.find(m => m._id === matchId);
        if (pendingMatch) {
            console.log('✅ Match found in pending list');
        } else {
            console.error('❌ Match NOT found in pending list');
        }

        // 5. Approve Match
        console.log('\n5. Approving Match...');
        const approveRes = await axios.post(`${BACKEND_URL}/matches/${matchId}/approve`);
        console.log('✅ Match Status:', approveRes.data.matchStatus);
        console.log('   Doctor Approval:', approveRes.data.doctorApproval);

        console.log('\n--- Verification Complete ---');
    } catch (error) {
        if (error.response) {
            console.error('❌ Verification Failed:', error.response.status, error.response.data);
        } else {
            console.error('❌ Verification Failed:', error.message);
        }
    }
};

runVerification();
