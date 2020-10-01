const Sequelize = require('sequelize');
const db = require('../config/DBConfig');


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
});

module.exports = EventSeatType;