const db = require('../config/DBConfig');

const User = require('./User');
const Event = require('./Event');
const Venue = require('./Venue');

// DO NOT SPECIFY PRIMARY OR FOREIGN KEYS HERE
// Go to DBConnection.js for more details
// Because we can't specify primary or foreign keys here, we can just leave the attributes empty for this model as its attributes are only foreign keys

const EventHelper = db.define('EventHelper');

module.exports = EventHelper;

// Event Helper Table Service Methods
// We use this to do CRUD and basically communicate with the database

// Every model should have their own version of this

module.exports.createEventHelpers = async (eventHelpers) => {
    return new Promise(async (resolve, reject) => {
        try {
            await EventHelper.bulkCreate(eventHelpers, {
                validate: true
            });
            resolve(eventHelpers);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports.getHelpersByEventId = async (eventId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const eventHelpers = await User.findAll({
                include: [{
                    model: EventHelper,
                    where: { eventId: eventId },
                    required: true
                }],
                attributes: {
                    exclude: ['password']
                },
                order: [['name', 'ASC']],
                raw: true
            });
            resolve(eventHelpers);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports.getEventsByHelperId = async (helperId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const events = await Event.findAll({
                include: [{
                    model: EventHelper,
                    where: { userId: helperId },
                    required: true,
                },
                {
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

module.exports.deleteEventHelpers = async (eventId) => {
    return new Promise(async (resolve, reject) => {
        try {
            await EventHelper.destroy({
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

module.exports.isHelperForEvent = async (helperId, eventId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const eventHelper = await EventHelper.findOne({
                where: { 
                    userId: helperId,
                    eventId: eventId,
                },
            });
            resolve(eventHelper != null);
        } catch (error) {
            reject(error);
        }
    });
};