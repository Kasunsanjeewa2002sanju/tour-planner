const express = require('express');
const { VEHICLE_TYPES, VEHICLE_DEFAULTS } = require('../constants/vehicleDefaults');

const router = express.Router();

// GET /api/vehicles/defaults - vehicle type presets for planning page
router.get('/defaults', (req, res) => {
    res.json({ vehicle_types: VEHICLE_TYPES, defaults: VEHICLE_DEFAULTS });
});

module.exports = router;
