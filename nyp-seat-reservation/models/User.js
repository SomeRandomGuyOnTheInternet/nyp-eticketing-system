const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
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
        allowNull: false,
        defaultValue: false
    },
    isPlanner: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    isHelper: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    isDeleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
});

module.exports = User;

// User Table Service Methods
// We use this to do CRUD and basically communicate with the database

// Every model should have their own version of this

module.exports.createUser = async (user) => { // 
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

module.exports.getHelpers = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let helpers = await User.findAll({ 
                where: { 
                    isHelper: true
                },
                order: [['name', 'ASC']]
            });

            resolve(helpers)
        } catch (error) {
            reject(error);
        }
    });
}

module.exports.getPlanners = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await User.findAll({ 
                where: { 
                    isPlanner: true
                },
                order: [['name', 'ASC']]
            });

            resolve(user)
        } catch (error) {
            reject(error);
        }
    });
}

//Delete user
module.exports.deleteuSers = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await User.getUserById(id)
            user.destroy();
            resolve(user)
        } catch (error) {
            reject(error);
        }
    });
}