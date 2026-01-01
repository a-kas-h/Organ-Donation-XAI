const express = require('express');
const mongoose = require('mongoose'); // Added missing import
const router = express.Router();
const Match = require('../models/Match');
const Donor = require('../models/Donor');
const Recipient = require('../models/Recipient');
const { getMatchPrediction } = require('../utils/mlClient');

// Generate a match
router.post('/generate', async (req, res) => {
    try {
        const { donorId, recipientId } = req.body;

        // Support both Mongo ID and Custom String ID
        let donor = null;
        if (mongoose.Types.ObjectId.isValid(donorId)) {
            donor = await Donor.findById(donorId);
        }
        if (!donor) {
            donor = await Donor.findOne({ donorId: donorId });
        }

        let recipient = null;
        if (mongoose.Types.ObjectId.isValid(recipientId)) {
            recipient = await Recipient.findById(recipientId);
        }
        if (!recipient) {
            recipient = await Recipient.findOne({ patientId: recipientId });
        }

        if (!donor || !recipient) {
            return res.status(404).json({ error: 'Donor or Recipient not found' });
        }

        const { isBloodTypeCompatible } = require('../utils/bloodTypeValidator'); // Import validator

        // ... (existing ID lookup code) ...

        const isCompatible = isBloodTypeCompatible(donor.bloodType, recipient.bloodType);

        let prediction = { match_score: 0 };
        let status = 'Pending';
        let alert = donor.organConditionAlert;

        if (!isCompatible) {
            status = 'Rejected';
            alert = `Incompatible Blood Type (Donor: ${donor.bloodType}, Recipient: ${recipient.bloodType})`;
        } else {
            // Only call ML if blood type is compatible
            prediction = await getMatchPrediction(donor, recipient);
        }

        const newMatch = new Match({
            patientId: recipient.patientId,
            donorId: donor.donorId,
            matchStatus: status,
            realTimeOrganHealthScore: donor.realTimeOrganHealthScore,
            organConditionAlert: alert,
            predictedSurvivalChance: prediction.match_score,
            organTrackingId: `ORGTRACK${Date.now()}`,
            timestampOrganScanned: new Date()
        });

        await newMatch.save();

        res.status(201).json(newMatch);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get pending matches
router.get('/pending', async (req, res) => {
    try {
        const matches = await Match.find({ matchStatus: 'Pending' });
        res.json(matches);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Approve a match
router.post('/:id/approve', async (req, res) => {
    try {
        const match = await Match.findById(req.params.id);
        if (!match) {
            return res.status(404).json({ error: 'Match not found' });
        }

        match.doctorApproval = {
            approved: true,
            signedAt: new Date(),
            remarks: "Approved by System"
        };
        match.matchStatus = 'Approved';
        await match.save();

        res.json(match);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
