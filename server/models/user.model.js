const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String
    },
    mails: [
        {
            body: String,
            to: String,
            read:{
                type: Boolean,
                default: false
            },
            readNumber: {
                type: Number,
                default: 0
            },
            createdAt: Date
        }
    ]
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);