const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

// All admin routes require super_admin role
router.use(authMiddleware);
router.use(requireRole('super_admin'));

// POST /api/admin/users - create a new admin account
router.post('/users', async (req, res) => {
    try {
        const { email, password, phone_number, current_address, country } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const password_hash = await bcrypt.hash(password, 10);
        const adminUser = new User({
            email,
            password_hash,
            role: 'admin',
            phone_number,
            current_address,
            country
        });

        await adminUser.save();
        res.status(201).json({ message: 'Admin created', adminId: adminUser._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /api/admin/users/:id - delete an admin account
router.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.role !== 'admin') {
            return res.status(400).json({ message: 'Only admin accounts can be deleted here' });
        }
        await User.findByIdAndDelete(id);
        res.json({ message: 'Admin deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/admin/users - list all admin accounts
router.get('/users', async (req, res) => {
    try {
        const admins = await User.find({ role: 'admin' }).select('-password_hash');
        res.json(admins);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;