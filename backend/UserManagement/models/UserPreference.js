const mongoose = require('mongoose');

const userPreferenceSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    default_start_location: {
        lat: Number,
        lng: Number,
        address: String
    },
    preferred_distance_unit: {
        type: String,
        enum: ['km', 'miles'],
        default: 'km'
    },
    current_vehicle_type: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('UserPreference', userPreferenceSchema);