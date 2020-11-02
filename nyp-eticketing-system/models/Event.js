const { truncate } = require('lodash');
const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Venue = require('./Venue');

// DO NOT SPECIFY PRIMARY OR FOREIGN KEYS HERE
// Go to DBConnection.js for more details

const Event = db.define('Event', {
    name: {
        type: Sequelize.STRING
    },
    seatMap: {
        type: Sequelize.TEXT
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

module.exports.getEventById = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const event = await Event.findOne({ 
                include: [{
                    model: Venue,
                    required: true,
                }],
                where: { id: id },
                raw: true,
            });

            if (event) {
                event.seatMap = JSON.parse(event.seatMap);
            }

            resolve(event);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports.getAllEvents = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const events = await Event.findAll({ 
                include: [{
                    model: Venue,
                    required: true,
                }],
                order: [['startDateTime', 'ASC']],
                raw: true 
            });
            resolve(events);
        } catch (error) {
            reject(error);
        }
    });
};