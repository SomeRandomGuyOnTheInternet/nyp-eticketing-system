const Sequelize = require('sequelize');
const db = require('../config/DBConfig');


const EventHelpers = db.define('EventHelpers');

module.exports = EventHelpers;