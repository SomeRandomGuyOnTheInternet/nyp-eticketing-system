const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

// DO NOT SPECIFY PRIMARY OR FOREIGN KEYS HERE
// Go to DBConnection.js for more details

const Venue = db.define('Venue', {
    name: {
        type: Sequelize.STRING
    },
    seatMap: {
        type: Sequelize.TEXT
    },
    isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
});

module.exports = Venue;

// Venue Table Service Helper Functions
// We create reusable helper functions for complicated db queries here. Usually only for get functions.

module.exports.getAllVenues = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let venues = await Venue.findAll({
                order: [['name', 'ASC']]
            });
            resolve(venues)
        } catch (error) {
            reject(error);
        }
    });
};