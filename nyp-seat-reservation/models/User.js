const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

// DO NOT SPECIFY PRIMARY OR FOREIGN KEYS HERE
// Go to DBConnection.js for more details

const User = db.define('User', {
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING
    },
    name: {
        type: Sequelize.STRING
    },
    isAdmin: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
    },
    isPlanner: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    isHelper: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    isDeleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
});

module.exports = User;

// User Table Service Methods
// We use this to do CRUD and basically communicate with the database

module.exports.createUser = async (user) => {
    return new Promise(async (resolve, reject) => {
        try {
            user.password = await bcrypt.hash(user.password, 10)
            await User.create(user);
            resolve(user)
        } catch (error) {
            reject(error);
        }
    });
}

module.exports.getUserById = async (userId) => { 
    return new Promise(async (resolve, reject) => {
        try {
            let user = await User.findOne({ 
                where: { 
                    id: userId
                } 
            });

            resolve(user)
        } catch (error) {
            reject(error);
        }
    });
}

module.exports.getUserByEmail = async (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await User.findOne({ 
                where: { 
                    email: email
                } 
            });

            resolve(user)
        } catch (error) {
            reject(error);
        }
    });
}