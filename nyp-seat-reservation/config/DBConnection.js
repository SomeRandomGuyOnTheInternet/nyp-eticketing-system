// Actual connection to the database happens here

const mySQLDB = require('./DBConfig'); // We import the sequelize object we configured from this file

// We wrote models without primary keys or foreign keys while defining them as sequelize automatically creates them
// However, we need to the various specify relationships between models to sequelize so it can create foreign keys accordingly
// These are the various models that have relationships with each other
const Events = require('../../nyp-seat-reservation/models/Event');
const Users = require('../../nyp-seat-reservation/models/User');
const Venues = require('../../nyp-seat-reservation/models/Venue');
const EventHelpers = require('../../nyp-seat-reservation/models/EventHelper');
const EventSeats = require('../../nyp-seat-reservation/models/EventSeat');
const EventAttendees = require('../../nyp-seat-reservation/models/EventAttendee');
const EventReservedSeats = require('../../nyp-seat-reservation/models/EventReservedSeat');
const EventSeatTypes = require('../../nyp-seat-reservation/models/EventSeatType');

// This function carries out the actual connection to the database while specifying all the relationships between the models
const setUpDB = (drop) => {
    mySQLDB.authenticate().then(() => {
        // Specify all models relationships here
        // Note that one to may relationships should always follow this format

        //event helpers & event
        Events.hasMany(EventHelpers, { foreignKey: 'EventId' });
        EventHelpers.belongsTo(Events, { foreignKey: 'EventId' });
        //event attendees & event
        Events.hasMany(EventAttendees, { foreignKey: 'EventId' });
        EventAttendees.belongsTo(Events, { foreignKey: 'EventId' });
        //event reserved seats & event
        Events.hasMany(EventReservedSeats, { foreignKey: 'EventId' });
        EventReservedSeats.belongsTo(Events, { foreignKey: 'EventId' });
        //event seats & event
        Events.hasMany(EventSeats, { foreignKey: 'EventId' });
        EventSeats.belongsTo(Events, { foreignKey: 'EventId'});
        //event seat type & event
        Events.hasMany(EventSeatTypes, { foreignKey: 'EventId' });
        EventSeatTypes.belongsTo(Events, { foreignKey: 'EventId' });


        //venues & planners
        Venues.hasMany(Users, { foreignKey: 'UserId' });
        Users.belongsTo(Venues, { foreignKey: 'UserId' });

        //events seats & events seat type
        EventSeats.hasMany(EventSeatTypes, { foreignKey: 'SeatTypeId' });
        EventSeatTypes.belongsTo( EventSeats, { foreignKey: 'SeatTypeId' });
        
        //events reserved seats & attendee
        EventReservedSeats.hasMany(EventAttendees, { foreignKey: 'AttendeeId' });
        EventAttendees.belongsTo(EventReservedSeats, { foreignKey: 'AttendeeId' });
        //events reserved seats & seat type
        EventReservedSeats.hasMany(EventSeatTypes, { foreignKey: 'SeatTypeId' });
        EventSeatTypes.belongsTo(EventReservedSeats, { foreignKey: 'SeatTypeId' });

        //user & event helpers
        Users.hasMany(EventHelpers, { foreignKey: 'UserId' });
        EventHelpers.belongsTo(Users, { foreignKey: 'UserId' });

        mySQLDB.sync({ force: drop })
    });
};

module.exports = {
    setUpDB
};