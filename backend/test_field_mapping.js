// Quick test for donor/recipient registration after field mapping fix
const BASE_URL = 'http://localhost:5000/api';

async function testRegistration() {
    try {
        // Test Donor Registration
        console.log('🧪 Testing Donor Registration...');
        const donorPayload = {
            donorId: `DN-FIX-${Date.now()}`,
            age: 35,
            weight: 75,
            height: 175,
            BMI: 24.5,
            bloodType: 'A+',
            organDonated: 'KIDNEY',
            realTimeOrganHealthScore: 95,
            organConditionAlert: 'None',
            medicalApproval: true
        };

        const donorRes = await fetch(`${BASE_URL}/donors`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(donorPayload)
        });

        if (donorRes.ok) {
            const donor = await donorRes.json();
            console.log('✅ Donor registered:', donor.donorId);
        } else {
            const error = await donorRes.json();
            console.log('❌ Donor failed:', error);
        }

        // Test Recipient Registration
        console.log('\n🧪 Testing Recipient Registration...');
        const recipientPayload = {
            patientId: `PAT-FIX-${Date.now()}`,
            age: 45,
            weight: 80,
            height: 170,
            BMI: 27.7,
            bloodType: 'A+',
            organRequired: 'KIDNEY',
            diagnosisResult: 'Requires KIDNEY transplant',
            biologicalMarkers: 0.5,
            organStatus: 'Waiting',
            riskScore: 50
        };

        const recipRes = await fetch(`${BASE_URL}/recipients`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(recipientPayload)
        });

        if (recipRes.ok) {
            const recip = await recipRes.json();
            console.log('✅ Recipient registered:', recip.patientId);
        } else {
            const error = await recipRes.json();
            console.log('❌ Recipient failed:', error);
        }

    } catch (err) {
        console.error('Test failed:', err);
    }
}

testRegistration();
