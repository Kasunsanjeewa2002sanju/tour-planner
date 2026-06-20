const mongoose = require('mongoose');
const { VEHICLE_TYPES, FUEL_TYPES } = require('../../TourManagement/constants/vehicleDefaults');

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
    vehicle_type: {
        type: String,
        enum: [...VEHICLE_TYPES, null],
        default: null
    },
    fuel_efficiency: {
        type: Number,
        min: 0,
        default: null
    },
    fuel_type: {
        type: String,
        enum: [...FUEL_TYPES, null],
        default: null
    },
    // Legacy field kept for backward compatibility
    current_vehicle_type: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

userPreferenceSchema.virtual('vehicle_setup_complete').get(function () {
    return Boolean(
        this.vehicle_type &&
        this.fuel_efficiency != null &&
        this.fuel_efficiency > 0 &&
        this.fuel_type
    );
});

userPreferenceSchema.set('toJSON', { virtuals: true });
userPreferenceSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('UserPreference', userPreferenceSchema);
