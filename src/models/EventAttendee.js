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
    noOfExtraAttendees: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
});

module.exports = EventAttendee;

// Event Attendee Service Methods
// We use this to do CRUD and basically communicate with the database

// Every model should have their own version of this

module.exports.getEventAttendeeById = async (attendeeId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const attendee = await EventAttendee.findOne({
                where: { 
                    id: attendeeId 
                },
                raw: true
            });
            resolve(attendee);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports.getEventAttendees = async (eventId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const attendees = await EventAttendee.findAll({
                where: { 
                    eventId: eventId 
                },
                raw: true
            });
            resolve(attendees);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports.getEventAttendeeByPhoneNumber = async (eventId, phoneNumber) => {
    return new Promise(async (resolve, reject) => {
        try {
            const attendees = await EventAttendee.findOne({
                where: { 
                    eventId: eventId,
                    phoneNumber: phoneNumber
                },
                raw: true
            });
            resolve(attendees);
        } catch (error) {
            reject(error);
        }
    });
};