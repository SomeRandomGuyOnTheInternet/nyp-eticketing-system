const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

// DO NOT SPECIFY PRIMARY OR FOREIGN KEYS HERE
// Go to DBConnection.js for more details

const EventAttendee = db.define('EventAttendee', {
    name: {
        type: Sequelize.STRING
    },
    phoneNumber: {
        type: Sequelize.INTEGER
    },
});

module.exports = EventAttendee;