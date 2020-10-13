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

// Venue Table Service Methods
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
};

module.exports.getVenueById = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let venue = await Venue.findOne({ 
                where: { 
                    id: id
                } 
            });

            if (venue) {
                venue.seatMap = JSON.parse(venue.seatMap);
            }

            resolve(venue)
        } catch (error) {
            reject(error);
        }
    });
};

module.exports.getAllVenues = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let venues = await Venue.findAll({ raw: true });
            resolve(venues)
        } catch (error) {
            reject(error);
        }
    });
};

module.exports.updateVenue = async (venue) => {
    return new Promise(async (resolve, reject) => {
        try {
            await Venue.update(
                venue,
                { where: { id: venue.id } }
            );

            resolve(venue)
        } catch (error) {
            reject(error);
        }
    });
};

module.exports.deleteVenue = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let venue = await Venue.getVenueById(id)
            venue.destroy();
            resolve(venue)
        } catch (error) {
            reject(error);
        }
    });
};