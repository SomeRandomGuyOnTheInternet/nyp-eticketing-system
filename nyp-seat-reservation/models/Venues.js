const Sequelize = require('sequelize');
const db = require('../config/DBConfig');


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