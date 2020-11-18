const express = require('express');
const router = express.Router();

const respond = require('../../utils/respond');

const Venue = require('../../models/Venue');

router.get('/test', async (req, res) => {
    try {
        const test = await Venue.getAllVenues();
        console.log(test);
        return respond.success(res, "It works! Yay!");
    } catch (error) {
        console.error(error);
        return respond.error(res, "Something went wrong while doing the test api noooooo!");
    }
});

module.exports = router;