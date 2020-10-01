const { Model } = require('sequelize');
//Bring in Sequalize
const Sequelize = require('sequelize');
//Bring in the db.js which contains databasename, username and password
const db = require('./db');

//Instantiates Sequelize with database parameters
const sequelize = new Sequelize(db.database, db.username, db.password, {
    host: db.host, // Name or IP address of MYSQL server
    dialect: 'mysql', //Tells squelize that MYSQL is used operatorAliases: false,
    define: {
        timestamps: true //Dont create timestamps fields in database
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    logging: false
});

module.exports = sequelize;