const mongoose = require('mongoose');


const MenuSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true,
        unique: true
    },
    url: {
        type: String
    },
    roles: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'role'
    },
    symboleType: {
        type: String,
        default: 'ICON',
        enum: ['ICON', 'IMAGE']
    },
    symbole: {
        type: String,
        default: 'unordered list'
    },
    isArtificial: {
        type: Boolean,
        default: true
    },
    contentType: {
        type: String,
        default: 'FORM',
        enum: ['FORM']
    },
    hasContent: {
        type: Boolean,
        default: false
    },
    submitConfigUrl: {
        type: String
    },
    submitConfigMethod: {
        type: String,
        enum: ['post', 'get']
    },
    redirectMenu: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'menu'
    },
    order: {
        type: Number
    },
    enabled : {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Menu', MenuSchema);