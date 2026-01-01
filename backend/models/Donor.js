const mongoose = require('mongoose');

const DonorSchema = new mongoose.Schema({
    donorId: { type: String, required: true, unique: true }, // e.g., DNR2025-001
    age: { type: Number, required: true },
    weight: { type: Number, required: true },
    BMI: { type: Number, required: true },
    bloodType: { type: String, required: true },
    organDonated: { type: String, required: true }, // e.g., Kidney
    realTimeOrganHealthScore: { type: Number, required: true },
    organConditionAlert: { type: String, default: "None" }, // e.g., Critical, Stable
    medicalApproval: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Donor', DonorSchema);
