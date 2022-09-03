const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

// DO NOT SPECIFY PRIMARY OR FOREIGN KEYS HERE
// Go to DBConnection.js for more details

const EventSeatType = db.define('EventSeatType', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    character: {
        type: Sequelize.CHAR,
        allowNull: false
    },
    isBlocked: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    cssClasses: {
        type: Sequelize.STRING
    },
});

module.exports = EventSeatType;

// Event Seat Type Table Service Methods
// We use this to do CRUD and basically communicate with the database

// Every model should have their own version of this

module.exports.getEventSeatTypes = async (eventId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const eventSeatTypes = await EventSeatType.findAll({
                where: { 
                    eventId: eventId 
                },
                raw: true
            });
            resolve(eventSeatTypes);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports.deleteEventSeatTypes = async (eventId) => {
    return new Promise(async (resolve, reject) => {
        try {
            await EventSeatType.destroy({
                where: {
                    eventId: eventId
                }
            })
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
};