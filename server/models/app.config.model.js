const mongoose = require('mongoose');


const AppConfigSchema = new mongoose.Schema({
    version: {
        type: String,
        required: true,
        unique: true
    },
    guestUrl: {
        type: String,
        default: 'https://flowcv.me/wassimmalleh'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('AppConfig', AppConfigSchema);