// All APIs are contained here

const express = require('express');
const router = express.Router();

const flash = require('../../utils/flash');
const respond = require('../../utils/respond');
const auth = require('../../utils/api-auth');

const Notification = require('../../models/Notification');

// Get all the unseen notification for the specific user
router.get('/', auth.isUser, async (req, res) => {
    try {
        const notifications = await Notification.findAll({ 
            where: { 
                userId: req.user.id,
                isSeen: false
            },
        });

        // All unseen notifications are flag as seen
        for (let i = 0; i < notifications.length; i++) {
            notifications[i].isSeen = true;
            await notifications[i].save();
        }

        return respond.success(res, "Notifications have been retrieved successfully!", notifications);
    } catch (error) {
        console.error(error);
        return respond.error(res, "Something went wrong while getting the Notifications. Please try again later!", 500);
    }
});

// Connects to sequalise and writes a new success notification
router.post('/success', auth.isUser, async (req, res) => {
    const message = req.body.data;
    if (!message)  return respond.error(res, "Please provide a message!");

    try {
        await Notification.createSuccess(message, req.user.id);
        return respond.success(res, "Notification has been created successfully!");
    } catch (error) {
        console.error(error);
        return respond.error(res, "Something went wrong while creating the notification. Please try again later!", 500);
    }
});

// Connects to sequalise and writes a new danger notification
router.post('/danger', auth.isUser, async (req, res) => {
    const message = req.body.data;
    if (!message)  return respond.error(res, "Please provide a message!");

    try {
        await Notification.createDanger(message, req.user.id);
        return respond.success(res, "Notification has been created successfully!");
    } catch (error) {
        console.error(error);
        return respond.error(res, "Something went wrong while creating the notification. Please try again later!", 500);
    }
});

module.exports = router;