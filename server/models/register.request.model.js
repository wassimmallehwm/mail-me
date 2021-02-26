const mongoose = require('mongoose');


const RegisterRequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('RegisterRequest', RegisterRequestSchema);


