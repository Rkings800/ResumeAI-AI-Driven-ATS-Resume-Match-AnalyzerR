const mongoose = require('mongoose');

async function connectToDB() {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.warn('Not working');
        return;
    }
    try { 
        await mongoose.connect(uri);
        console.log('Connected to MongoDB ✅');
    } catch (error) {
        console.error('kya hua pata nahi', error);
    }
}

module.exports = connectToDB;