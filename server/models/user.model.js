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
    imagePath : {
        type: String,
        default: 'user.png'
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
    ],
    accounts: [
        {
            label: {
                type: String,
                unique: true
            },
            email: {
                type: String,
                unique: true
            },
            createdAt: {
                type: Date,
                default: new Date()
            }
        }
    ]
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);