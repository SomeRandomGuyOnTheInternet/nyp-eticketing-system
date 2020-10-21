// Actual connection to the database happens here

const mySQLDB = require('./DBConfig'); // We import the sequelize object we configured from this file

// We wrote models without primary keys or foreign keys while defining them as sequelize automatically creates them
// However, we need to the various specify relationships between models to sequelize so it can create foreign keys accordingly
// These are the various models that have relationships with each other
const Events = require('../models/Event');
const Users = require('../models/User');
const Venues = require('../models/Venue');
const EventHelpers = require('../models/EventHelper');
const EventReservedSeats = require('../models/EventReservedSeat');
const EventAttendees = require('../models/EventAttendee');
const EventSeatTypes = require('../models/EventSeatType');

// const createUsers = require('./dataset/create-users');
// const createVenues = require('./dataset/create-venues');

// This function carries out the actual connection to the database while specifying all the relationships between the models
const setUpDB = (drop) => {
    mySQLDB.authenticate().then(() => {
        // Specify all models relationships here
        // Note that one to may relationships should always follow this format

        // Each venue can house many events
        Venues.hasMany(Events, { foreignKey: 'venueId' });
        Events.belongsTo(Venues, { foreignKey: 'venueId' });

        // Each user (planners) can create many venues
        Users.hasMany(Venues, { foreignKey: 'userId' });
        Venues.belongsTo(Users, { foreignKey: 'userId' });

        // Each event has many seat types
        Events.hasMany(EventSeatTypes, { foreignKey: 'eventId' });
        EventSeatTypes.belongsTo(Events, { foreignKey: 'eventId' });

        // Each event can have many reserved seats
        Events.hasMany(EventReservedSeats, { foreignKey: 'eventId' });
        EventReservedSeats.belongsTo(Events, { foreignKey: 'eventId' });

        // Each event can have many helpers
        Events.hasMany(EventHelpers, { foreignKey: 'eventId' });
        EventHelpers.belongsTo(Events, { foreignKey: 'eventId' });

        // Each user can help with many events
        Users.hasMany(EventHelpers, { foreignKey: 'userId' });
        EventHelpers.belongsTo(Users, { foreignKey: 'userId' });

        // Each event has many attendees
        Events.hasMany(EventAttendees, { foreignKey: 'eventId' });
        EventAttendees.belongsTo(Events, { foreignKey: 'eventId' });

        // Each attendee can reserve many seats in an event
        EventAttendees.hasMany(EventReservedSeats, { foreignKey: 'attendeeId' });
        EventReservedSeats.belongsTo(EventAttendees, { foreignKey: 'attendeeId' });

        mySQLDB.sync({ 
            force: drop 
        }).then(() => {
            // if (drop == true) {
            //     createUsers(Users);
            //     createVenues(Venues);
            // }
        });
    });
};

module.exports = {
    setUpDB
};