const { Model } = require('sequelize');
const Sequelize = require('sequelize');
const db = require('../config/DBConfig');


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