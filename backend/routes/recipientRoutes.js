const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Recipient = require('../models/Recipient');

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

module.exports = router;
