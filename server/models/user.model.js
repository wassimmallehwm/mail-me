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
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    },
    imagePath : {
        type: String,
        default: 'user_default'
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
                type: String
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
    ],
    enabled : {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);