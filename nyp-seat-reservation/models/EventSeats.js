const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

// DO NOT SPECIFY PRIMARY OR FOREIGN KEYS HERE
// Go to DBConnection.js for more details

const EventSeats = db.define('EventSeats', {
    seatID: {
        type: Sequelize.STRING
    },
});

module.exports = EventSeats;