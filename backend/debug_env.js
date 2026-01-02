const dotenv = require('dotenv');
const result = dotenv.config();

if (result.error) {
    console.log('❌ Dotenv failed:', result.error);
} else {
    console.log('✅ Dotenv config loaded');
    console.log('Parsed keys:', Object.keys(result.parsed || {}));
}

console.log('MONGO_URI Present:', !!process.env.MONGO_URI);
if (process.env.MONGO_URI) {
    console.log('MONGO_URI Value (masked):', process.env.MONGO_URI.substring(0, 15) + '...');
}
