const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

// All admin routes require admin or super_admin role
router.use(authMiddleware);

// Middleware to check if user is at least an admin
const adminOnly = (req, res, next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};

router.use(adminOnly);

// POST /api/admin/users - create a new user (role based)
router.post('/users', async (req, res) => {
    try {
        const { email, password, phone_number, current_address, country, role } = req.body;

        // Restriction: Only super_admin can create admins or super_admins
        if ((role === 'admin' || role === 'super_admin') && req.user.role !== 'super_admin') {
            return res.status(403).json({ message: 'Only super admins can create admin accounts' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const password_hash = await bcrypt.hash(password, 10);
        const newUser = new User({
            email,
            password_hash,
            role: role || 'user',
            phone_number,
            current_address,
            country
        });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully', userId: newUser._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/admin/users - list users based on role
router.get('/users', async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'admin') {
            // Admin can only see users and tour guides
            query = { role: { $in: ['user', 'tour_guide'] } };
        }
        // Super admin can see everyone except maybe themselves or just all
        const users = await User.find(query).select('-password_hash');
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const targetUser = await User.findById(id);
        if (!targetUser) return res.status(404).json({ message: 'User not found' });

        // Restriction: Only super_admin can delete admins
        if (targetUser.role === 'admin' && req.user.role !== 'super_admin') {
            return res.status(403).json({ message: 'Only super admins can delete admin accounts' });
        }
        
        // Cannot delete a super_admin unless you are a super_admin (and maybe not yourself)
        if (targetUser.role === 'super_admin' && req.user.role !== 'super_admin') {
             return res.status(403).json({ message: 'Cannot delete super admin' });
        }

        await User.findByIdAndDelete(id);
        res.json({ message: 'User deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;