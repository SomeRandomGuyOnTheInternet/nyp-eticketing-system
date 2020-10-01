const mySQLDB = require('./DBConfig');

const Events = require('../../models/Events');
const Users = require('../../models/Users');
const Venues = require('../../models/Venues');
const EventHelpers = require('../../models/EventHelpers');
const EventSeats = require('../../models/EventSeats');
const EventAttendees = require('../../models/EventAttendees');
const EventReservedSeats = require('../../models/EventReservedSeats');
const EventSeatTypes = require('../models/EventSeatTypes');

const setUpDB = (drop) => {
    mySQLDB.authenticate()
    .then(() => {
        mySQLDB.sync({ force: drop })

    })
};



module.exports = {
    setUpDB
};