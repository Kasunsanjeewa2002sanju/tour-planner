const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const UserPreference = require('../models/UserPreference');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/users/me
router.get('/me', async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password_hash');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PATCH /api/users/me - update email/password/phone/address/country
router.patch('/me', async (req, res) => {
    try {
        const { email, password, phone_number, current_address, country } = req.body;
        const updates = {};

        if (email) updates.email = email;
        if (phone_number) updates.phone_number = phone_number;
        if (current_address) updates.current_address = current_address;
        if (country) updates.country = country;

        if (password) {
            const saltRounds = 10;
            updates.password_hash = await bcrypt.hash(password, saltRounds);
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updates,
            { new: true, runValidators: true }
        ).select('-password_hash');

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/users/me/preferences
router.get('/me/preferences', async (req, res) => {
    try {
        let prefs = await UserPreference.findOne({ user_id: req.user.id });
        if (!prefs) {
            prefs = { user_id: req.user.id };
        }
        res.json(prefs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PATCH /api/users/me/preferences
router.patch('/me/preferences', async (req, res) => {
    try {
        const { default_start_location, preferred_distance_unit, current_vehicle_type } = req.body;

        let prefs = await UserPreference.findOne({ user_id: req.user.id });
        if (!prefs) {
            prefs = new UserPreference({ user_id: req.user.id });
        }

        if (default_start_location) prefs.default_start_location = default_start_location;
        if (preferred_distance_unit) prefs.preferred_distance_unit = preferred_distance_unit;
        if (current_vehicle_type) prefs.current_vehicle_type = current_vehicle_type;

        await prefs.save();
        res.json(prefs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;