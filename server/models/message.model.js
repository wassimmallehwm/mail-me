const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const MessageSchema = new mongoose.Schema({
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'conversation'
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    text: {
        type: String
    }
}, {
    timestamps: true
});

MessageSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Message', MessageSchema);