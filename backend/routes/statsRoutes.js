const express = require('express');
const router = express.Router();
const Recipient = require('../models/Recipient');
const Donor = require('../models/Donor');
const Match = require('../models/Match');

// GET /api/stats/overview
router.get('/overview', async (req, res) => {
    try {
        const [totalRecipients, waitingRecipients, totalDonors, totalMatches] = await Promise.all([
            Recipient.countDocuments({}),
            Recipient.countDocuments({ organStatus: 'Waiting' }),
            Donor.countDocuments({}),
            Match.countDocuments({ matchStatus: 'Approved' }),
        ]);

        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const allocationsToday = await Match.countDocuments({
            matchStatus: 'Approved',
            createdAt: { $gte: startOfDay },
        });

        // Very simple average wait time placeholder:
        // since we don't track per-recipient match time, approximate from createdAt of matches.
        const matchedRecipients = await Match.find({ matchStatus: 'Approved' })
            .select('createdAt')
            .limit(100)
            .lean();

        let avgWaitDays = 0;
        if (matchedRecipients.length > 0) {
            const diffs = matchedRecipients.map((m) => {
                const created = m.createdAt || now;
                const diffMs = now - created;
                return diffMs / (1000 * 60 * 60 * 24);
            });
            avgWaitDays = diffs.reduce((a, b) => a + b, 0) / diffs.length;
        }

        res.json({
            totalRecipients,
            waitingRecipients,
            totalDonors,
            availableDonors: totalDonors, // refined logic can be added later
            allocationsToday,
            avgWaitDays: Number(avgWaitDays.toFixed(1)),
            totalAllocations: totalMatches,
        });
    } catch (error) {
        console.error('Stats overview error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

