const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000/predict-match';

const getMatchPrediction = async (donor, recipient) => {
    try {
        const payload = {
            donor: {
                Donor_Age: donor.age,
                Donor_Weight: donor.weight
            },
            recipient: {
                Patient_Age: recipient.age,
                Patient_BMI: recipient.BMI,
                Patient_Weight: recipient.weight,
                Biological_Markers: recipient.biologicalMarkers,
                RealTime_Organ_HealthScore: donor.realTimeOrganHealthScore,
                Risk_Score: recipient.riskScore
            }
        };

        const response = await axios.post(ML_SERVICE_URL, payload);
        return response.data;
    } catch (error) {
        console.error('Error calling ML Service:', error.message);
        throw error;
    }
};

module.exports = { getMatchPrediction };
