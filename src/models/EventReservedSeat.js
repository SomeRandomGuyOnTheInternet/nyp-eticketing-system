const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

// DO NOT SPECIFY PRIMARY OR FOREIGN KEYS HERE
// Go to DBConnection.js for more details

const EventReservedSeat = db.define('EventReservedSeat', {
    seatNumber: {
        type: Sequelize.STRING
    },
});

module.exports = EventReservedSeat;

// Event Reserved Seat Table Service Methods
// We use this to do CRUD and basically communicate with the database

// Every model should have their own version of this

module.exports.getEventReservedSeat = async (eventId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const reservedSeats = await EventReservedSeat.findAll({
                where: { 
                    eventId: eventId 
                },
                raw: true
            });
            resolve(reservedSeats);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports.getAttendeeReservedSeat = async (attendeeId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const reservedSeats = await EventReservedSeat.findAll({
                where: { 
                    attendeeId: attendeeId 
                },
                raw: true
            });
            resolve(reservedSeats);
        } catch (error) {
            reject(error);
        }
    });
};