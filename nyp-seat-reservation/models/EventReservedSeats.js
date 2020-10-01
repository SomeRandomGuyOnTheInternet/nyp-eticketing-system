const Sequelize = require('sequelize');
const db = require('../config/DBConfig');


const EventReservedSeats = db.define('EventReservedSeats');

module.exports = EventReservedSeats;