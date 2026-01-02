const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Match = require('../models/Match');
const Donor = require('../models/Donor');
const Recipient = require('../models/Recipient');
const { getMatchPrediction } = require('../utils/mlClient');
const { isBloodTypeCompatible } = require('../utils/bloodTypeValidator');

// Helper function to create a random transaction hash
const generateTxHash = () => {
    return '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
};

// POST /api/allocation/trigger
router.post('/trigger', async (req, res) => {
    try {
        console.log("🚀 Allocation Triggered...");

        // 1. Fetch available resources
        // Use a loose filter for now to pick up anyone created recently, or stick to 'Pending' if we had a status field
        // For donors, we assume *all* donors in the DB are available if they haven't been matched yet.
        // But we don't have a 'status' field on Donor yet in the schema shown, only 'organConditionAlert'.
        // Let's assume for this MVP we just fetch recent donors.
        // A better approach is to check if donorId is already in the Match collection.

        const allDonors = await Donor.find({});
        const allRecipients = await Recipient.find({ organStatus: 'Waiting' });

        console.log(`🔎 Found ${allDonors.length} donors and ${allRecipients.length} waiting recipients.`);

        if (allDonors.length === 0 || allRecipients.length === 0) {
            return res.status(200).json({ message: "No candidates for allocation." });
        }

        const matchesFound = [];

        // 2. Iterate and Match
        // Naive O(N*M) matching for demonstration
        for (const donor of allDonors) {
            // Check if donor is already matched
            const existingMatch = await Match.findOne({ donorId: donor.donorId });
            if (existingMatch) continue;

            for (const recipient of allRecipients) {
                // Must be same organ type
                if (donor.organDonated !== recipient.organRequired) continue;

                // Blood type compatibility
                if (!isBloodTypeCompatible(donor.bloodType, recipient.bloodType)) continue;

                // 3. Get ML Prediction
                console.log(`🤖 Predicting match for Donor ${donor.donorId} -> Recipient ${recipient.patientId}`);
                let prediction;
                try {
                    prediction = await getMatchPrediction(donor, recipient);
                } catch (mlError) {
                    console.error("ML Service Error:", mlError.message);
                    prediction = { match_score: 50 }; // Fallback
                }

                // Threshold for auto-allocation (e.g. > 70%)
                if (prediction.match_score > 70) {
                    // Create Match
                    const newMatch = new Match({
                        patientId: recipient.patientId,
                        donorId: donor.donorId,
                        matchStatus: 'Approved', // Auto-approve for this "Trigger" demo
                        realTimeOrganHealthScore: donor.realTimeOrganHealthScore,
                        organConditionAlert: donor.organConditionAlert,
                        predictedSurvivalChance: prediction.match_score,
                        organTrackingId: `ORG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                        timestampOrganScanned: new Date(),
                        doctorApproval: {
                            approved: true,
                            signedAt: new Date(),
                            remarks: "Auto-allocated via Admin Trigger"
                        }
                    });

                    await newMatch.save();

                    // Update Recipient Status
                    recipient.organStatus = 'Matched';
                    await recipient.save();

                    matchesFound.push({
                        organ: donor.organDonated,
                        recipientHash: recipient.patientId, // Using ID as hash for now
                        urgencyScore: prediction.match_score,
                        txHash: generateTxHash(),
                        timestamp: new Date().toLocaleString()
                    });

                    // Break recipient loop, this donor is used (and hypothetically this recipient is satisfied)
                    // In a real system we'd find the BEST match, not the first > 70
                    break;
                }
            }
        }

        // Return the best match or the last match found for the UI to display
        // The UI expects a single object for "allocation" state, or we could return list.
        // The UI code: `setAllocation(data)` expects object with { organ, recipientHash, urgencyScore, txHash, timestamp }

        if (matchesFound.length > 0) {
            // Return the highest scoring match
            matchesFound.sort((a, b) => b.urgencyScore - a.urgencyScore);
            return res.json(matchesFound[0]);
        } else {
            return res.status(200).json(null); // No match found
        }

    } catch (error) {
        console.error("Allocation Error:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
