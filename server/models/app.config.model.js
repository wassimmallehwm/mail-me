const mongoose = require('mongoose');


const AppConfigSchema = new mongoose.Schema({
    version: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('AppConfig', AppConfigSchema);