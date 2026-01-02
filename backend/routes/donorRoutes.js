const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Donor = require('../models/Donor');

// Create Donor
router.post('/', async (req, res) => {
    console.log(`Donors POST hit. DB ReadyState: ${mongoose.connection.readyState}`);
    try {
        const donor = new Donor(req.body);
        await donor.save();
        res.status(201).json(donor);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all Donors
router.get('/', async (req, res) => {
    try {
        const donors = await Donor.find();
        res.json(donors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
