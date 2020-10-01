const Sequelize = require('sequelize');
const db = require('../config/DBConfig');


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
    role: {
        type: Sequelize.STRING
    },
    isDeleted: {
        type: Sequelize.BOOLEAN
    },
});

module.exports = Users;