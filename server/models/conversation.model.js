const mongoose = require('mongoose');


const ConversationSchema = new mongoose.Schema({
    members: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'user'
    },
    enabled : {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Conversation', ConversationSchema);