const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    password_hash: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'tour_guide', 'admin', 'super_admin'],
        default: 'user'
    },
    phone_number: {
        type: String,
        trim: true
    },
    current_address: {
        type: String,
        trim: true
    },
    country: {
        type: String,
        trim: true
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('User', userSchema);