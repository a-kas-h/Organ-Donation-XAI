const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Match = require('../models/Match');
const Donor = require('../models/Donor');
const Recipient = require('../models/Recipient');
const { getMatchPrediction } = require('../utils/mlClient');
const { isBloodTypeCompatible } = require('../utils/bloodTypeValidator');

// NEW ENDPOINT: Find Top 3 Donors for a Recipient and Store in DB
router.post('/find-top-donors', async (req, res) => {
    try {
        const { recipientId } = req.body;

        if (!recipientId) {
            return res.status(400).json({ error: 'recipientId is required' });
        }

        console.log(`🔍 Finding top donors for recipient: ${recipientId}`);

        // 1. Find the recipient
        let recipient = await Recipient.findOne({ patientId: recipientId });
        if (!recipient) {
            return res.status(404).json({ error: 'Recipient not found' });
        }

        if (recipient.organStatus !== 'Waiting') {
            return res.status(400).json({
                error: `Recipient status is '${recipient.organStatus}'. Only 'Waiting' recipients can request matches.`
            });
        }

        // 2. Find all available donors (not already matched)
        const allDonors = await Donor.find({});

        // Get already matched donor IDs
        const matchedDonorIds = await Match.find({ matchStatus: 'Approved' })
            .distinct('donorId');

        // Filter out already matched donors
        const availableDonors = allDonors.filter(d => !matchedDonorIds.includes(d.donorId));

        console.log(`📊 Found ${availableDonors.length} available donors (${allDonors.length} total, ${matchedDonorIds.length} already matched)`);

        // 3. Filter by organ type and blood compatibility
        const compatibleDonors = availableDonors.filter(donor => {
            if (donor.organDonated !== recipient.organRequired) return false;
            if (!isBloodTypeCompatible(donor.bloodType, recipient.bloodType)) return false;
            return true;
        });

        console.log(`✅ ${compatibleDonors.length} compatible donors (organ + blood type match)`);

        if (compatibleDonors.length === 0) {
            return res.json({
                recipientId: recipient.patientId,
                recipientName: recipient.fullName || 'Unknown',
                organRequired: recipient.organRequired,
                topMatches: [],
                matchesStored: 0,
                message: 'No compatible donors found'
            });
        }

        // 4. Get ML predictions for each compatible donor
        const donorScores = [];
        for (const donor of compatibleDonors) {
            try {
                const prediction = await getMatchPrediction(donor, recipient);
                donorScores.push({
                    donorId: donor.donorId,
                    donor: {
                        donorId: donor.donorId,
                        age: donor.age,
                        weight: donor.weight,
                        BMI: donor.BMI,
                        bloodType: donor.bloodType,
                        organDonated: donor.organDonated,
                        organHealthScore: donor.realTimeOrganHealthScore,
                        organCondition: donor.organConditionAlert
                    },
                    predictedScore: prediction.match_score,
                    riskLevel: prediction.risk_level || 'UNKNOWN'
                });
                console.log(`  → Donor ${donor.donorId}: Score ${prediction.match_score}`);
            } catch (mlError) {
                console.error(`ML prediction failed for donor ${donor.donorId}:`, mlError.message);
                donorScores.push({
                    donorId: donor.donorId,
                    donor: {
                        donorId: donor.donorId,
                        age: donor.age,
                        weight: donor.weight,
                        BMI: donor.BMI,
                        bloodType: donor.bloodType,
                        organDonated: donor.organDonated,
                        organHealthScore: donor.realTimeOrganHealthScore,
                        organCondition: donor.organConditionAlert
                    },
                    predictedScore: 50,
                    riskLevel: 'UNKNOWN'
                });
            }
        }

        // 5. SORT by predicted score (descending - highest first)
        donorScores.sort((a, b) => b.predictedScore - a.predictedScore);

        // 6. SELECT top 3
        const top3 = donorScores.slice(0, 3);

        console.log(`🏆 Top 3 donors: ${top3.map(d => `${d.donorId}(${d.predictedScore})`).join(', ')}`);

        // 7. STORE top 3 matches in database
        const savedMatches = [];
        for (let i = 0; i < top3.length; i++) {
            const match = top3[i];
            try {
                const newMatch = new Match({
                    patientId: recipient.patientId,
                    donorId: match.donorId,
                    matchStatus: 'Pending',
                    realTimeOrganHealthScore: match.donor.organHealthScore,
                    organConditionAlert: match.donor.organCondition,
                    predictedSurvivalChance: match.predictedScore,
                    organTrackingId: `ORG-${Date.now()}-${i}-${Math.floor(Math.random() * 1000)}`,
                    timestampOrganScanned: new Date(),
                    doctorApproval: {
                        approved: false,
                        remarks: `Top-3 match (Rank #${i + 1}) - Awaiting approval`
                    }
                });

                await newMatch.save();
                savedMatches.push(newMatch);
                console.log(`✅ Stored match: ${match.donorId} → ${recipient.patientId} (Score: ${match.predictedScore})`);
            } catch (saveError) {
                console.error(`Failed to save match for ${match.donorId}:`, saveError.message);
            }
        }

        return res.json({
            recipientId: recipient.patientId,
            recipientName: recipient.fullName || 'Unknown',
            organRequired: recipient.organRequired,
            bloodType: recipient.bloodType,
            topMatches: top3,
            totalCompatible: compatibleDonors.length,
            matchesStored: savedMatches.length,
            message: `Successfully stored ${savedMatches.length} top matches in database`
        });

    } catch (error) {
        console.error('Error finding top donors:', error);
        res.status(500).json({ error: error.message });
    }
});

// NEW ENDPOINT: Doctor Approves a Match
router.post('/approve', async (req, res) => {
    try {
        const { recipientId, donorId, doctorId, remarks } = req.body;

        if (!recipientId || !donorId) {
            return res.status(400).json({ error: 'recipientId and donorId are required' });
        }

        console.log(`✅ Doctor approval request: Donor ${donorId} → Recipient ${recipientId}`);

        const donor = await Donor.findOne({ donorId });
        const recipient = await Recipient.findOne({ patientId: recipientId });

        if (!donor || !recipient) {
            return res.status(404).json({ error: 'Donor or Recipient not found' });
        }

        if (donor.organDonated !== recipient.organRequired) {
            return res.status(400).json({
                error: `Organ type mismatch: Donor has ${donor.organDonated}, Recipient needs ${recipient.organRequired}`
            });
        }

        if (!isBloodTypeCompatible(donor.bloodType, recipient.bloodType)) {
            return res.status(400).json({
                error: `Blood type incompatible: Donor ${donor.bloodType}, Recipient ${recipient.bloodType}`
            });
        }

        const existingMatch = await Match.findOne({ donorId, matchStatus: 'Approved' });
        if (existingMatch) {
            return res.status(400).json({
                error: `Donor ${donorId} is already matched to patient ${existingMatch.patientId}`
            });
        }

        if (recipient.organStatus === 'Matched') {
            return res.status(400).json({
                error: `Recipient ${recipientId} is already matched`
            });
        }

        let prediction;
        try {
            prediction = await getMatchPrediction(donor, recipient);
        } catch (mlError) {
            console.error('ML prediction failed:', mlError.message);
            prediction = { match_score: 50, risk_level: 'UNKNOWN' };
        }

        const newMatch = new Match({
            patientId: recipient.patientId,
            donorId: donor.donorId,
            matchStatus: 'Approved',
            realTimeOrganHealthScore: donor.realTimeOrganHealthScore,
            organConditionAlert: donor.organConditionAlert,
            predictedSurvivalChance: prediction.match_score,
            organTrackingId: `ORG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            timestampOrganScanned: new Date(),
            doctorApproval: {
                approved: true,
                doctorId: doctorId || 'UNKNOWN',
                signedAt: new Date(),
                remarks: remarks || 'Match approved via Top-3 selection'
            }
        });

        await newMatch.save();

        recipient.organStatus = 'Matched';
        await recipient.save();

        console.log(`✅ Match approved and saved: ${newMatch._id}`);

        return res.status(201).json({
            message: 'Match approved successfully',
            match: newMatch,
            predictedScore: prediction.match_score,
            riskLevel: prediction.risk_level
        });

    } catch (error) {
        console.error('Error approving match:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
