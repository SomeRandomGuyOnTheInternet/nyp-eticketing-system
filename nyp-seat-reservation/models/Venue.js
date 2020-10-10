const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

// DO NOT SPECIFY PRIMARY OR FOREIGN KEYS HERE
// Go to DBConnection.js for more details

const Venue = db.define('Venue', {
    name: {
        type: Sequelize.STRING
    },
    seatChart: {
        type: Sequelize.STRING
    },
    isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
});



module.exports = Venue;

// Venie Table Service Methods
// We use this to do CRUD and basically communicate with the database

// Every model should have their own version of this

module.exports.createVenue = async (venue) => { // 
    return new Promise(async (resolve, reject) => {
        try {
            await Venue.create(venue);
            resolve(venue)
        } catch (error) {
            reject(error);
        }
    });
}

module.exports.getVenueById = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let venue = await Venue.findOne({ 
                where: { 
                    id: id
                } 
            });

            resolve(venue)
        } catch (error) {
            reject(error);
        }
    });
}