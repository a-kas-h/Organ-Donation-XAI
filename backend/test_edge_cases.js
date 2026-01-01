const axios = require('axios');

const runEdgeCases = async () => {
    try {
        console.log("--- Testing Low Survival Chance Scenario ---");

        const BAD_DONOR_ID = `DNR_BAD_${Date.now()}`;
        const BAD_PATIENT_ID = `PAT_BAD_${Date.now()}`;

        // 1. Create a "Bad" Donor (High Age, Low Health)
        await axios.post('http://localhost:5000/api/donors', {
            donorId: BAD_DONOR_ID,
            age: 80,             // Very old
            weight: 45,          // Very low weight
            BMI: 15,             // Underweight
            bloodType: "AB-",
            organDonated: "Kidney",
            realTimeOrganHealthScore: 20, // Very poor health score
            medicalApproval: true
        });

        // 2. Create a "Bad" Recipient (High Risk, Incompatible traits)
        await axios.post('http://localhost:5000/api/recipients', {
            patientId: BAD_PATIENT_ID,
            age: 20,             // Huge age difference (60 years)
            weight: 120,         // Huge weight difference
            BMI: 40,             // Obese
            bloodType: "O+",     // Incompatible blood type (though ML might not check this, logic usually does)
            organRequired: "Kidney",
            diagnosisResult: "Critical Failure",
            biologicalMarkers: 9.5, // High bad markers
            riskScore: 9.8       // Very high risk
        });

        // 3. Generate Match
        const start = Date.now();
        const matchRes = await axios.post('http://localhost:5000/api/matches/generate', {
            donorId: BAD_DONOR_ID,
            recipientId: BAD_PATIENT_ID
        });

        const score = matchRes.data.predictedSurvivalChance;
        console.log(`\n🔴 Prediction for Bad Match: ${score.toFixed(2)}%`);

        if (score < 50) {
            console.log("✅ Model correctly predicted LOW survival chance.");
        } else {
            console.log("⚠️ Model predicted high survival despite bad stats. (Model might need retraining or features might act differently)");
        }

    } catch (error) {
        console.error("❌ Error:", error.response ? error.response.data : error.message);
    }
};

runEdgeCases();
