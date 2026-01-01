const mongoose = require('mongoose');
const Match = require('./models/Match');
const dotenv = require('dotenv');

dotenv.config();

const inspectMatch = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Find the most recent match
        const match = await Match.findOne().sort({ createdAt: -1 });

        if (match) {
            console.log("\n--- Most Recent Match from DB ---");
            console.log("ID:", match._id);
            console.log("Predicted Survival Chance (ML Output):", match.predictedSurvivalChance);
            console.log("Donor ID:", match.donorId);
            console.log("Recipient ID:", match.patientId);
            console.log("Status:", match.matchStatus);
            console.log("Full Document:");
            console.log(JSON.stringify(match, null, 2));
        } else {
            console.log("No matches found in DB.");
        }

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

inspectMatch();
