const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
    patientId: { type: String, required: true }, // Using String ID like PAT2025-001 for JSON consistency
    donorId: { type: String, required: true },   // Using String ID like DNR2025-001

    // Linking to actual Mongo Objects is still good practice for internal reference, 
    // but if user strictly wants the JSON format provided, we might just store strings. 
    // However, it's safer to keep Refs if we need to look them up. 
    // Let's keep the String IDs as primary display data.

    matchStatus: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },

    realTimeOrganHealthScore: { type: Number, required: true }, // Snapshot at match time
    organConditionAlert: { type: String, default: 'None' },
    predictedSurvivalChance: { type: Number, required: true }, // The score

    organTrackingId: { type: String }, // Generated on approval? or creation
    timestampOrganScanned: { type: Date },

    doctorApproval: {
        approved: { type: Boolean, default: false },
        signedAt: { type: Date, default: null },
        remarks: { type: String, default: null }
    },

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Match', MatchSchema);
