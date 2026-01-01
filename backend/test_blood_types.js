const axios = require('axios');

const runBloodTypeTest = async () => {
    try {
        console.log("--- Testing Blood Type Compatibility ---");

        const INC_DONOR_ID = `DNR_A_PLUS_${Date.now()}`;
        const INC_PATIENT_ID = `PAT_O_PLUS_${Date.now()}`;

        // 1. Create Incompatible Pair
        // Donor A+ -> Recipient O+ (O+ can only take O)
        await axios.post('http://localhost:5000/api/donors', {
            donorId: INC_DONOR_ID,
            age: 30, weight: 70, BMI: 22, bloodType: "A+", // A+
            organDonated: "Kidney", realTimeOrganHealthScore: 90, medicalApproval: true
        });

        await axios.post('http://localhost:5000/api/recipients', {
            patientId: INC_PATIENT_ID,
            age: 30, weight: 70, BMI: 22, bloodType: "O+", // O+
            organRequired: "Kidney", diagnosisResult: "CKD", biologicalMarkers: 1, riskScore: 1
        });

        const matchRes = await axios.post('http://localhost:5000/api/matches/generate', {
            donorId: INC_DONOR_ID,
            recipientId: INC_PATIENT_ID
        });

        console.log("\n🧪 Test 1: Incompatible (A+ -> O+)");
        console.log("Status:", matchRes.data.matchStatus);
        console.log("Alert:", matchRes.data.organConditionAlert);
        console.log("Score:", matchRes.data.predictedSurvivalChance);

        if (matchRes.data.matchStatus === 'Rejected' && matchRes.data.predictedSurvivalChance === 0) {
            console.log("✅ Correctly REJECTED due to blood type.");
        } else {
            console.log("❌ FAILED to reject.");
        }

    } catch (error) {
        console.error("❌ Error:", error.response ? error.response.data : error.message);
    }
};

runBloodTypeTest();
