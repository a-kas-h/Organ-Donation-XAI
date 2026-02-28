const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Recipient = require('../models/Recipient');

// Simple helper to generate an anonymous but stable hash-like identifier
const makePatientHash = (patientId) => {
    if (!patientId) return 'UNKNOWN';
    const prefix = patientId.slice(0, 3);
    const suffix = patientId.slice(-4);
    return `0x${prefix}...${suffix}`;
};

// Create Recipient
router.post('/', async (req, res) => {
    try {
        const recipient = new Recipient(req.body);
        await recipient.save();
        res.status(201).json(recipient);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all Recipients
router.get('/', async (req, res) => {
    try {
        const recipients = await Recipient.find();
        res.json(recipients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Waiting List view for dashboards
router.get('/waiting', async (req, res) => {
    try {
        const { organ } = req.query;

        const query = { organStatus: 'Waiting' };
        if (organ && organ !== 'ALL') {
            query.organRequired = organ.toUpperCase();
        }

        const recipients = await Recipient.find(query).sort({ createdAt: -1 });

        const waitingList = recipients.map((r) => ({
            id: r._id.toString(),
            patientHash: makePatientHash(r.patientId),
            urgencyScore: r.riskScore,
            organ: r.organRequired,
            status: r.organStatus,
            timestamp: r.createdAt ? r.createdAt.toISOString() : new Date().toISOString(),
        }));

        res.json(waitingList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
