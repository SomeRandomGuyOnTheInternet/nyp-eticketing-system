// Configure sequelize settings here

const Sequelize = require('sequelize'); // Sequelize is used as a database wrapper so that communcation between MySQL and the app is easier and faster by using better syntax

// Creates a sequelize object with database parameters to enable connection to the database and other settings
const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST, // Specifies the IP address of the database
    dialect: 'mysql', // Specifies that we're using a MySQL database
    define: {
        timestamps: true // Automatically creates timestamp fields in tables
    },
    pool: { // Network usage stuff ??? idk probably best to keep it same
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    logging: false
});

module.exports = sequelize;