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

module.exports.createUser = async (user) => {
    user.password = await bcrypt.hash(user.password, 10)
    return await User.create(user);
}

module.exports.getUserById = async (userId) => {
    return await User.findAll({ 
        where: { 
            userId
        } 
    });
}