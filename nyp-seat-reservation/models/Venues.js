const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

// DO NOT SPECIFY PRIMARY OR FOREIGN KEYS HERE
// Go to DBConnection.js for more details

const Venues = db.define('Venues', {
    Name: {
        type: Sequelize.STRING
    },
    seatChart: {
        type: Sequelize.STRING
    },
    isDeleted: {
        type: Sequelize.BOOLEAN
    },
});

module.exports = Venues;