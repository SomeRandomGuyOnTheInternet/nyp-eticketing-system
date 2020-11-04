// All APIs are contained here

const express = require('express');
const router = express.Router();

const flash = require('../../utils/flash');
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

router.post('/success-flash', async (req, res) => {
    flash.success(req, req.body.data);
    return respond.success(res);
});

router.post('/error-flash', async (req, res) => {
    flash.error(req, req.body.data);
    return respond.success(res);
});

module.exports = router;