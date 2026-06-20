const VEHICLE_TYPES = ['Bus', 'Car', 'Van', 'Bike', 'Three Wheeler'];
const FUEL_TYPES = ['Petrol', 'Diesel'];

// Fuel efficiency in km/L (kilometers per liter)
const VEHICLE_DEFAULTS = {
    Bus: { fuel_efficiency: 3, fuel_type: 'Diesel' },
    Car: { fuel_efficiency: 12, fuel_type: 'Petrol' },
    Van: { fuel_efficiency: 7, fuel_type: 'Diesel' },
    Bike: { fuel_efficiency: 40, fuel_type: 'Petrol' },
    'Three Wheeler': { fuel_efficiency: 20, fuel_type: 'Petrol' }
};

module.exports = { VEHICLE_TYPES, FUEL_TYPES, VEHICLE_DEFAULTS };
