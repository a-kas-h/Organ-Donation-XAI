const mongoose = require('mongoose');

const RecipientSchema = new mongoose.Schema({
    patientId: { type: String, required: true, unique: true }, // e.g., PAT2025-001
    age: { type: Number, required: true },
    weight: { type: Number, required: true },
    BMI: { type: Number, required: true },
    bloodType: { type: String, required: true },
    organRequired: { type: String, required: true },
    diagnosisResult: { type: String, required: true },
    biologicalMarkers: { type: Number, required: true },
    organStatus: { type: String, default: "Waiting" },
    riskScore: { type: Number, required: true }, // From patient history probably
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recipient', RecipientSchema);
