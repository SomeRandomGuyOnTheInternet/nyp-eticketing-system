const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

// DO NOT SPECIFY PRIMARY OR FOREIGN KEYS HERE
// Go to DBConnection.js for more details

const Users = db.define('Users', {
    email: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    name: {
        type: Sequelize.STRING
    },
    isAdmin: {
        type: Sequelize.BOOLEAN
    },
    isPlanner: {
        type: Sequelize.BOOLEAN
    },
    isHelper: {
        type: Sequelize.BOOLEAN
    },
    isDeleted: {
        type: Sequelize.BOOLEAN
    },
});

module.exports = Users;