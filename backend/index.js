const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Routes Import
const authRoutes = require('./UserManagement/routes/auth');
const userRoutes = require('./UserManagement/routes/users');
const adminRoutes = require('./UserManagement/routes/admin');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

app.use(cors());
app.use(express.json());

// Routes Middleware
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/destinations', require('./DestinationManagement/routes/destinations'));
app.use('/api/fuel', require('./TourManagement/routes/fuel'));
app.use('/api/vehicles', require('./TourManagement/routes/vehicles'));

// Service static files (images)
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.send('Tour Planner API is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
