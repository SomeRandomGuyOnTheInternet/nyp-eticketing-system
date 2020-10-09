const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

// DO NOT SPECIFY PRIMARY OR FOREIGN KEYS HERE
// Go to DBConnection.js for more details

const Events = db.define('Events', {
    name: {
        type: Sequelize.STRING
    },
    startDateTime: {
        type: Sequelize.DATE
    },
    seatsPerReservation: {
        type: Sequelize.INTEGER
    },
    prioritiseBackRows: {
        type: Sequelize.BOOLEAN
    },
    isDeleted: {
        type: Sequelize.BOOLEAN
    },
});

module.exports = Events;

