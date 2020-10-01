const Sequelize = require('sequelize');
const db = require('../config/DBConfig');


const EventAttendees = db.define('EventAttendees', {
    name: {
        type: Sequelize.STRING
    },
    phoneNumber: {
        type: Sequelize.INTEGER
    },
});

module.exports = EventAttendees;