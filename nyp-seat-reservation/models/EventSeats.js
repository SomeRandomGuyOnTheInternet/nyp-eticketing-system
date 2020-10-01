const Sequelize = require('sequelize');
const db = require('../config/DBConfig');


const EventSeats = db.define('EventSeats', {
    seatID: {
        type: Sequelize.STRING
    },
});

module.exports = EventSeats;