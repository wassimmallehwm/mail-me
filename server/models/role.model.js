const mongoose = require('mongoose');


const RoleSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true,
        unique: true
    },
    enabled : {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Role', RoleSchema);