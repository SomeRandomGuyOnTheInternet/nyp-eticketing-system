const mySQLDB = require('./DBConfig');

const Events = require('../../nyp-seat-reservation/models/Events');
const Users = require('../../nyp-seat-reservation/models/Users');
const Venues = require('../../nyp-seat-reservation/models/Venues');
const EventHelpers = require('../../nyp-seat-reservation/models/EventHelpers');
const EventSeats = require('../../nyp-seat-reservation/models/EventSeats');
const EventAttendees = require('../../nyp-seat-reservation/models/EventAttendees');
const EventReservedSeats = require('../../nyp-seat-reservation/models/EventReservedSeats');
const EventSeatTypes = require('../../nyp-seat-reservation/models/EventSeatType');

const setUpDB = (drop) => {
    mySQLDB.authenticate()
    .then(() => {
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

    })
};

module.exports = {
    setUpDB
};