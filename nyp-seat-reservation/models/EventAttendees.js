const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

// DO NOT SPECIFY PRIMARY OR FOREIGN KEYS HERE
// Go to DBConnection.js for more details

const EventAttendees = db.define('EventAttendees', {
    name: {
        type: Sequelize.STRING
    },
    phoneNumber: {
        type: Sequelize.INTEGER
    },
});

module.exports = EventAttendees;