const mongoose = require('mongoose');

const fuelPriceSchema = new mongoose.Schema({
    petrol_price: {
        type: Number,
        required: true,
        default: 1.50,
        min: 0
    },
    diesel_price: {
        type: Number,
        required: true,
        default: 1.40,
        min: 0
    },
    currency: {
        type: String,
        default: 'USD'
    },
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('FuelPrice', fuelPriceSchema);
