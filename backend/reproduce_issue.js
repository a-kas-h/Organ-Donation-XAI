const axios = require('axios');

// Using the exact IDs the user likely wants to use or compatible ones
const DONOR_ID = "DNR1767248663484";
const RECIPIENT_ID = "PAT1767248663616";

const runTest = async () => {
    try {
        console.log("1. Creating Donor with Custom ID...");
        try {
            await axios.post('http://localhost:5000/api/donors', {
                donorId: DONOR_ID,
                age: 35,
                weight: 70,
                BMI: 24,
                bloodType: "O+",
                organDonated: "Kidney",
                realTimeOrganHealthScore: 90,
                medicalApproval: true
            });
            console.log("✅ Donor Created");
        } catch (e) {
            console.log("⚠️  Donor might already exist (Status:", e.response?.status, ")");
        }

        console.log("2. Creating Recipient with Custom ID...");
        try {
            await axios.post('http://localhost:5000/api/recipients', {
                patientId: RECIPIENT_ID,
                age: 45,
                weight: 68,
                BMI: 26,
                bloodType: "O+",
                organRequired: "Kidney",
                diagnosisResult: "CKD",
                biologicalMarkers: 4.5,
                riskScore: 3
            });
            console.log("✅ Recipient Created");
        } catch (e) {
            console.log("⚠️  Recipient might already exist (Status:", e.response?.status, ")");
        }

        console.log("3. Generating Match using Custom IDs...");
        const matchRes = await axios.post('http://localhost:5000/api/matches/generate', {
            donorId: DONOR_ID,
            recipientId: RECIPIENT_ID
        });

        console.log("✅ Match Response:", JSON.stringify(matchRes.data, null, 2));

    } catch (error) {
        console.error("❌ Error:", error.response ? error.response.data : error.message);
    }
};

// Wait for server to start roughly
setTimeout(runTest, 5000);
