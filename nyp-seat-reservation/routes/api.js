// All APIs are contained here

const express = require('express');
const router = express.Router();

const flash = require('../utils/flash');
const ajax = require('../utils/ajax');

const Venue = require('../models/Venue');

router.post('/create-venue', async (req, res) => {
    const name = req.body.name;
    const seatMap = JSON.stringify(req.body.seatMap);

    if (!name) {
        ajax.error(res, "Please enter a venue name!");
        return;
    }

    if (!seatMap) {
        ajax.error(res, "Please enter a seat map for the venue!");
        return;
    }

    await Venue.createVenue({
        name: name,
        seatMap: seatMap
    });

    ajax.success(res, "Successfully added venue!");
    flash.success(req, "Venue has been successfully created!");
    return
});

router.get('/get-all-venues', async (req, res) => {
    const venues = await Venue.getAllVenues();
    ajax.success(res, "Successfully gotten all venues!", venues);
    return
});

router.post('/update-venue', async (req, res) => {
    let venue = req.body.venue;

    if (!venue.name) {
        ajax.error(res, "Please enter a venue name!");
        return;
    }

    if (!venue.seatMap) {
        ajax.error(res, "Please enter a seat map for the venue!");
        return;
    }

    venue.seatMap = JSON.stringify(venue.seatMap);

    await Venue.updateVenue(venue);

    ajax.success(res, "Successfully updated venue!");
    flash.success(req, "Venue has been successfully updated!");
    return
});

module.exports = router;