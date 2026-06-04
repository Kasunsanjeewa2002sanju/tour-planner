require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');

const seedSuperAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const existingSuper = await User.findOne({ role: 'super_admin' });
        if (existingSuper) {
            console.log('Super admin already exists');
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash('Admin123!', 10);
        const superAdmin = new User({
            email: 'super@example.com',
            password_hash: hashedPassword,
            role: 'super_admin',
            phone_number: '+1234567890',
            current_address: 'Super Admin Office',
            country: 'Global'
        });

        await superAdmin.save();
        console.log('Super admin created: super@example.com / Admin123!');
        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    }
};

seedSuperAdmin();