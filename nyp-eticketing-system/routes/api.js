// TODO: Make message flashing an API

// All APIs are contained here

const express = require('express');
const router = express.Router();

const flash = require('../utils/flash');
const ajax = require('../utils/ajax');

const User = require('../models/User');
const Venue = require('../models/Venue');
const Event = require('../models/Event');
const EventSeatType = require('../models/EventSeatType');
const EventAttendee = require('../models/EventAttendee');
const EventHelper = require('../models/EventHelper');
const EventReservedSeat = require('../models/EventReservedSeat');


router.get('/test', async (req, res) => {
    const test = await Venue.getAllEvents();
    console.log(test);
    ajax.success(res, "It works! Yay!");
});

router.post('/success-flash', async (req, res) => {
    flash.success(req, req.body.message)
    ajax.success(res);
});

router.post('/error-flash', async (req, res) => {
    flash.error(req, req.body.message)
    ajax.success(res);
});


router.post('/create-venue', async (req, res) => {
    const name = req.body.name;
    const seatMap = JSON.stringify(req.body.seatMap);

    if (!name) {
        return ajax.error(res, "Please enter a venue name!");
    }

    if (!seatMap) {
        return ajax.error(res, "Please enter a seat map for the venue!");
    }

    await Venue.createVenue({
        name: name,
        seatMap: seatMap
    });

    return ajax.success(res, "Successfully added venue!");
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
});

router.get('/delete-venue/:id', async (req, res) => {
	const id = req.params.id;
	await Venue.deleteVenue(id);
	res.redirect('/planner/venues');
});


router.post('/create-event', async (req, res) => {
    const name = req.body.name;
    const seatMap = JSON.stringify(req.body.seatMap);
    const startDateTime = req.body.startDateTime;
    const prioritiseBackRows = req.body.prioritiseBackRows;
    const seatsPerReservation = req.body.seatsPerReservation == '' ? null : req.body.seatsPerReservation;
    const venueId = req.body.venueId == '' ? null : req.body.venueId;

    if (!name) {
        ajax.error(res, "Please enter a event name!");
        return;
    }

    if (!seatMap) {
        ajax.error(res, "Please enter a seat map for the event!");
        return;
    }

    if (!startDateTime) {
        ajax.error(res, "Please enter a valid start date/time for the event!");
        return;
    }

    if (seatsPerReservation) {
        if (isNaN(seatsPerReservation)) {
            ajax.error(res, "Please enter a valid max number of seats per reservation!");
            return;
        } else {
            if (seatsPerReservation < 1) {
                ajax.error(res, "Please enter a higher number of seats per reservation!");
                return;
            }

            if (seatsPerReservation > 10) {
                ajax.error(res, "Please enter a lower number of seats per reservation!");
                return;
            }
        }
    }

    if (!venueId) {
        ajax.error(res, "Please enter a valid id for the venue!");
        return;
    }

    if (isNaN(venueId)) {
        ajax.error(res, "Please enter a valid id for the venue!");
        return;
    }

    const event = await Event.createEvent({
        name: name,
        seatMap: seatMap,
        startDateTime: startDateTime,
        seatsPerReservation: seatsPerReservation,
        prioritiseBackRows: prioritiseBackRows,
        venueId: venueId
    });

    ajax.success(res, "Successfully created event!", event);
});


router.get('/helpers/:helperId/events/:eventId/', async (req, res) => {
    const eventId = req.params.eventId;
    const helperId = req.params.helperId;

    const isHelper = await EventHelper.isHelperForEvent(helperId, eventId);

	if (!isHelper) {
        ajax.error(res, "This helper is not authorised to help for this event!");
        return;
    }

    let event = await Event.getEventById(eventId);
    event.seatTypes = await EventSeatType.getEventSeatTypes(eventId);
    event.reservedSeats = await EventReservedSeat.getEventReservedSeat(eventId);
    
    return ajax.success(res, "Successfully gotten event details for the helper!", event);
});


router.get('/get-all-helpers', async (req, res) => {
    const helpers = await User.getHelpers();
    ajax.success(res, "Successfully gotten all helpers!", helpers);
    return
});


router.post('/create-event-seat-types', async (req, res) => {
    const seatTypes = req.body.seatTypes;
    // TODO: Do validation for each seat type in array
    await EventSeatType.createEventSeatTypes(seatTypes);

    ajax.success(res, "Successfully created event seat types!");
});


router.post('/create-event-helpers', async (req, res) => {
    const eventHelpers = req.body.eventHelpers;
    // TODO: Do validation for each event helper in array
    await EventHelper.createEventHelpers(eventHelpers);
    
    ajax.success(res, "Successfully created event helpers!");
});


router.post('/create-event-attendee', async (req, res) => {
    const name = req.body.name;
    const phoneNumber = parseInt(req.body.phoneNumber, 8);
    const eventId = req.body.eventId;
    let eventAttendee;

    if (name === "") {
        return ajax.error(res, "Please provide an attendee name!");
    }

    if (phoneNumber === "") {
        return ajax.error(res, "Please provide an attendee phone number!");
    }

    if (!(/^[0-9]{8}$/.test(phoneNumber))) {
        return ajax.error(res, "Please provide a valid eight digit attendee phone number!");
    }

    eventAttendee = await EventAttendee.getEventAttendeeByPhoneNumber(eventId, phoneNumber);
    
    if (typeof eventAttendee === 'undefined' || eventAttendee === null) {
        eventAttendee = await EventAttendee.create({
            name: name,
            phoneNumber: phoneNumber,
            eventId: eventId
        });
    }

    ajax.success(res, "Successfully created event attendee!", eventAttendee);
});

router.post('/create-event-seat-reservation', async (req, res) => {
    const seatNumber = req.body.seatNumber;
    const eventId = req.body.eventId;
    const attendeeId = req.body.attendeeId

    // TODO: Validate whether seat number is valid

    if (seatNumber === "") {
        return ajax.error(res, "Please provide a seat number to reserve!");
    }

    if (eventId === "") {
        return ajax.error(res, "Please provide a event id to reserve the seat for!");
    }

    if (attendeeId === "") {
        return ajax.error(res, "Please provide the id of the attendee the seats belong to!");
    }

    const seatReservation = await EventReservedSeat.create({
        seatNumber: seatNumber,
        eventId: eventId,
        attendeeId: attendeeId
    });
    
    ajax.success(res, "Successfully created reservation!", seatReservation);
});


// SMS POST
router.post('/sms-attendee', async (req, res) => {
    
    
    ajax.success(res, "Successfully sent a SMS confirmation to Attendee!");
});

module.exports = router;