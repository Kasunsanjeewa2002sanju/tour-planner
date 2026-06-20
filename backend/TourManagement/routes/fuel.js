const express = require('express');
const FuelPrice = require('../models/FuelPrice');
const { authMiddleware } = require('../../UserManagement/middleware/auth');

const router = express.Router();

const adminOnly = (req, res, next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};

async function getOrCreateFuelPrices() {
    let prices = await FuelPrice.findOne().sort({ updatedAt: -1 });
    if (!prices) {
        prices = await FuelPrice.create({
            petrol_price: 1.50,
            diesel_price: 1.40,
            currency: 'USD'
        });
    }
    return prices;
}

// GET /api/fuel/prices - authenticated users fetch current fuel prices
router.get('/prices', authMiddleware, async (req, res) => {
    try {
        const prices = await getOrCreateFuelPrices();
        res.json(prices);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/fuel/admin/prices - admin fetch
router.get('/admin/prices', authMiddleware, adminOnly, async (req, res) => {
    try {
        const prices = await getOrCreateFuelPrices();
        res.json(prices);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/fuel/admin/prices - admin update
router.put('/admin/prices', authMiddleware, adminOnly, async (req, res) => {
    try {
        const { petrol_price, diesel_price, currency } = req.body;

        let prices = await FuelPrice.findOne().sort({ updatedAt: -1 });
        if (!prices) {
            prices = new FuelPrice();
        }

        if (petrol_price !== undefined) {
            const parsed = Number(petrol_price);
            if (!Number.isFinite(parsed) || parsed < 0) {
                return res.status(400).json({ message: 'Petrol price must be a valid positive number' });
            }
            prices.petrol_price = parsed;
        }
        if (diesel_price !== undefined) {
            const parsed = Number(diesel_price);
            if (!Number.isFinite(parsed) || parsed < 0) {
                return res.status(400).json({ message: 'Diesel price must be a valid positive number' });
            }
            prices.diesel_price = parsed;
        }
        if (currency !== undefined) prices.currency = currency;
        if (req.user?.id) prices.updated_by = req.user.id;

        await prices.save();
        res.json(prices);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
});

module.exports = router;
