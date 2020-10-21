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

// Event Table Service Methods
// We use this to do CRUD and basically communicate with the database

// Every model should have their own version of this

module.exports.createEventAttendee = async (eventAttendee) => {
    return new Promise(async (resolve, reject) => {
        try {
            const eventAttendee = await EventAttendee.create(eventAttendee);
            resolve(eventAttendee);
        } catch (error) {
            reject(error);
        }
    });
};