const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

// DO NOT SPECIFY PRIMARY OR FOREIGN KEYS HERE
// Go to DBConnection.js for more details

const Event = db.define('Event', {
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
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
});

module.exports = Event;

// Event Table Service Methods
// We use this to do CRUD and basically communicate with the database

// Every model should have their own version of this

module.exports.createEvent = async (event) => {
    return new Promise(async (resolve, reject) => {
        try {
            await Event.create(event);
            resolve(event);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports.getEventById = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let event = await Event.findOne({ 
                where: { 
                    id: id
                } 
            });

            resolve(event);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports.getAllEvents = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let events = await Event.findAll({ raw: true });
            resolve(events);
        } catch (error) {
            reject(error);
        }
    });
};