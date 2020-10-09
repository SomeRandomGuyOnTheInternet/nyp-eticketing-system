const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

// DO NOT SPECIFY PRIMARY OR FOREIGN KEYS HERE
// Go to DBConnection.js for more details
// Because we can't specify primary or foreign keys here, we can just leave the attributes empty for this model as its attributes are only foreign keys

const EventHelper = db.define('EventHelper');

module.exports = EventHelper;