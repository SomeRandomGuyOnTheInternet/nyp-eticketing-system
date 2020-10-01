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
        mySQLDB.sync({ force: drop })

    })
};



module.exports = {
    setUpDB
};