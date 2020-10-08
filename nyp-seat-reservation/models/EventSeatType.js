const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

// DO NOT SPECIFY PRIMARY OR FOREIGN KEYS HERE
// Go to DBConnection.js for more details

const EventSeatType = db.define('EventSeatType', {
    type: {
        type: Sequelize.STRING
    },
    isBlocked: {
        type: Sequelize.BOOLEAN
    },
    seatChartCharacter: {
        type: Sequelize.CHAR
    },
    classes: {
        type: Sequelize.STRING
    },
});

module.exports = EventSeatType;