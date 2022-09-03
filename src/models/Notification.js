const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const User = require('./User');

// DO NOT SPECIFY PRIMARY OR FOREIGN KEYS HERE
// Go to DBConnection.js for more details

const Notification = db.define('Notification', {
    message: {
        type: Sequelize.STRING
    },
    type: {
        type: Sequelize.TEXT
    },
    isSeen: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
});

module.exports = Notification;

// Notification Table Service Methods

module.exports.createSuccess = async (message, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const notification = await Notification.create({
                message: message,
                type: "success",
                userId: userId
            });

            resolve(notification);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports.createDanger = async (message, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const notification = await Notification.create({
                message: message,
                type: "danger",
                userId: userId
            });

            resolve(notification);
        } catch (error) {
            reject(error);
        }
    });
};