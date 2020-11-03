// All APIs are contained here

const express = require('express');
const axios = require('axios');
const moment = require('moment');
const XML = require('pixl-xml');
const router = express.Router();

const flash = require('../../utils/flash');
const respond = require('../../utils/respond');

const User = require('../../models/User');
const Venue = require('../../models/Venue');
const Event = require('../../models/Event');
const EventSeatType = require('../../models/EventSeatType');
const EventAttendee = require('../../models/EventAttendee');
const EventHelper = require('../../models/EventHelper');
const EventReservedSeat = require('../../models/EventReservedSeat');

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

router.post('/create-venue', async (req, res) => {
    const name = req.body.name;
    const seatMap = JSON.stringify(req.body.seatMap);

    if (!name) {
        return respond.error(res, "Please enter a venue name!");
    }

    if (!seatMap) {
        return respond.error(res, "Please enter a seat map for the venue!");
    }

    try {
        await Venue.createVenue({
            name: name,
            seatMap: seatMap
        });

        return respond.success(res, "Successfully added venue!");
    } catch (error) {
        console.error(error);
        return respond.error(res, "Something went wrong while creating this venue!", 500);
    }
});

router.get('/get-all-venues', async (req, res) => {
    try {
        const venues = await Venue.getAllVenues();
        return respond.success(res, "Successfully gotten all venues!", venues);
    } catch (error) {
        console.error(error);
        return respond.error(res, "Something went wrong while getting all venues!", 500);
    }
});

router.post('/update-venue', async (req, res) => {
    let venue = req.body.venue;

    if (!venue.name) {
        return respond.error(res, "Please enter a venue name!");
    }

    if (!venue.seatMap) {
        return respond.error(res, "Please enter a seat map for the venue!");
    }

    venue.seatMap = JSON.stringify(venue.seatMap);

    try {
        await Venue.updateVenue(venue);
        return respond.success(res, "Successfully updated venue!");
    } catch (error) {
        console.error(error);
        return respond.error(res, "Something went wrong while updating this venue!", 500);
    }
});

router.get('/delete-venue/:id', async (req, res) => {
    const id = req.params.id;
    
    try {
        await Venue.deleteVenue(id);
        return respond.success(res, "Successfully deleted venue!");
    } catch (error) {
        console.error(error);
        return respond.error(res, "Something went wrong while deleting this venue!", 500);
    }
});

router.post('/create-event', async (req, res) => {
    const name = req.body.name;
    const seatMap = JSON.stringify(req.body.seatMap);
    const startDateTime = req.body.startDateTime;
    const prioritiseBackRows = req.body.prioritiseBackRows;
    const seatsPerReservation = req.body.seatsPerReservation == '' ? null : req.body.seatsPerReservation;
    const venueId = req.body.venueId == '' ? null : req.body.venueId;

    if (!name) {
        return respond.error(res, "Please enter a event name!");
    }

    if (!seatMap) {
        return respond.error(res, "Please enter a seat map for the event!");
    }

    if (!startDateTime) {
        return respond.error(res, "Please enter a valid start date/time for the event!");
    }

    if (seatsPerReservation) {
        if (isNaN(seatsPerReservation)) {
            return respond.error(res, "Please enter a valid max number of seats per reservation!");
        } else {
            if (seatsPerReservation < 1) {
                return respond.error(res, "Please enter a higher number of seats per reservation!");
            }

            if (seatsPerReservation > 10) {
                return respond.error(res, "Please enter a lower number of seats per reservation!");
            }
        }
    }

    if (!venueId) {
        return respond.error(res, "Please enter a valid id for the venue!");
    }

    try {
        const event = await Event.createEvent({
            name: name,
            seatMap: seatMap,
            startDateTime: startDateTime,
            seatsPerReservation: seatsPerReservation,
            prioritiseBackRows: prioritiseBackRows,
            venueId: venueId
        });
        
        return respond.success(res, "Successfully created event!", event);
    } catch (error) {
        console.error(error);
        return respond.error(res, "Something went wrong while creating this event. Please try again later!", 500);
    }
});

router.post('/update-event', async (req, res) => {
    const eventId = req.body.eventId;
    const name = req.body.name;
    const seatMap = JSON.stringify(req.body.seatMap);
    const startDateTime = req.body.startDateTime;
    const prioritiseBackRows = req.body.prioritiseBackRows;
    const seatsPerReservation = req.body.seatsPerReservation == '' ? null : req.body.seatsPerReservation;
    const venueId = req.body.venueId == '' ? null : req.body.venueId;

    if (!eventId) {
        return respond.error(res, "Please provide an event id!");
    }

    if (!name) {
        return respond.error(res, "Please enter a event name!");
    }

    if (!seatMap) {
        return respond.error(res, "Please enter a seat map for the event!");
    }

    if (!startDateTime) {
        return respond.error(res, "Please enter a valid start date/time for the event!");
    }

    if (seatsPerReservation) {
        if (isNaN(seatsPerReservation)) {
            return respond.error(res, "Please enter a valid max number of seats per reservation!");
        } else {
            if (seatsPerReservation < 1) {
                return respond.error(res, "Please enter a higher number of seats per reservation!");
            }

            if (seatsPerReservation > 10) {
                return respond.error(res, "Please enter a lower number of seats per reservation!");
            }
        }
    }

    if (!venueId) {
        return respond.error(res, "Please enter a valid id for the venue!");
    }

    try {
        const event = await Event.update(
			{
                name: name,
                seatMap: seatMap,
                startDateTime: startDateTime,
                seatsPerReservation: seatsPerReservation,
                prioritiseBackRows: prioritiseBackRows,
                venueId: venueId
            },
            { 
                where: { 
                    id: eventId 
                } 
            },
		);
        
        return respond.success(res, "Successfully created event!", event);
    } catch (error) {
        console.error(error);
        return respond.error(res, "Something went wrong while updating this event. Please try again later!", 500);
    }
});

router.get('/events/:eventId/', async (req, res) => {
    const eventId = req.params.eventId;

    try {
        let event = await Event.getEventById(eventId);
        event.seatTypes = await EventSeatType.getEventSeatTypes(eventId);
        event.reservedSeats = await EventReservedSeat.getEventReservedSeat(eventId);
        event.venue = await Venue.getVenueById(event.venueId);
        event.helpers = await EventHelper.getHelpersByEventId(eventId);

        return respond.success(res, "Successfully gotten event details!", event);
    } catch (error) {
        console.error(error);
        return respond.error(res, "Something went wrong while getting the event details. Please try again later!", 500);
    }
});


router.get('/helpers/:helperId/events/:eventId/', async (req, res) => {
    const eventId = req.params.eventId;
    const helperId = req.params.helperId;

    try {
        const isHelper = await EventHelper.isHelperForEvent(helperId, eventId);

        if (!isHelper) {
            return respond.error(res, "This helper is not authorised to help for this event!");
        }

        let event = await Event.getEventById(eventId);
        event.seatTypes = await EventSeatType.getEventSeatTypes(eventId);
        event.reservedSeats = await EventReservedSeat.getEventReservedSeat(eventId);
        event.venue = await Venue.getVenueById(event.venueId);

        return respond.success(res, "Successfully gotten event details for the helper!", event);
    } catch (error) {
        console.error(error);
        return respond.error(res, "Something went wrong while getting the event details. Please try again later!", 500);
    }
});


router.get('/get-all-helpers', async (req, res) => {
    try {
        const helpers = await User.getHelpers();
        return respond.success(res, "Successfully gotten all helpers!", helpers);
    } catch (error) {
        console.error(error);
        return respond.error(res, "Something went wrong while getting all the helpers. Please try again later!", 500);
    }
});


router.post('/create-event-seat-types', async (req, res) => {
    const seatTypes = req.body.seatTypes;

    // TODO: Do validation for each seat type in array

    try {
        await EventSeatType.createEventSeatTypes(seatTypes);
        return respond.success(res, "Successfully created event seat types!");
    } catch (error) {
        console.error(error);
        return respond.error(res, "Something went wrong while creating the event's seat types. Please try again later!", 500);
    }
});

router.post('/update-event-seat-types', async (req, res) => {
    const eventId = req.body.eventId;
    const seatTypes = req.body.seatTypes;

    // TODO: Do validation for each seat type in array

    try {
        await EventSeatType.deleteEventSeatTypes(eventId);
        await EventSeatType.createEventSeatTypes(seatTypes);
        return respond.success(res, "Successfully updated event seat types!");
    } catch (error) {
        console.error(error);
        return respond.error(res, "Something went wrong while updating the event's seat types. Please try again later!", 500);
    }
});


router.post('/create-event-helpers', async (req, res) => {
    const eventHelpers = req.body.eventHelpers;

    // TODO: Do validation for each event helper in array

    try {
        await EventHelper.createEventHelpers(eventHelpers);
        return respond.success(res, "Successfully created event helpers!");
    } catch (error) {
        console.error(error);
        return respond.error(res, "Something went wrong while creating the event's helpers. Please try again later!", 500);
    }
});

router.post('/update-event-helpers', async (req, res) => {
    const eventId = req.body.eventId;
    const eventHelpers = req.body.eventHelpers;

    // TODO: Do validation for each event helper in array

    try {
        await EventHelper.deleteEventHelpers(eventId);
        await EventHelper.createEventHelpers(eventHelpers);
        return respond.success(res, "Successfully updated event helpers!");
    } catch (error) {
        console.error(error);
        return respond.error(res, "Something went wrong while updating the event's helpers. Please try again later!", 500);
    }
});


router.post('/create-event-attendee', async (req, res) => {
    const name = req.body.name;
    const phoneNumber = parseInt(req.body.phoneNumber, 10);
    const eventId = req.body.eventId;

    if (!name) {
        return respond.error(res, "Please provide an attendee name!");
    }

    if (!eventId) {
        return respond.error(res, "Please provide an event id!");
    }

    if (!phoneNumber) {
        return respond.error(res, "Please provide an attendee phone number!");
    }

    if (!(/^[0-9]{8}$/.test(phoneNumber))) {
        return respond.error(res, "Please provide a valid eight digit attendee phone number!");
    }
    
    try {
        const existingEventAttendee = await EventAttendee.getEventAttendeeByPhoneNumber(eventId, phoneNumber);
        if (!existingEventAttendee) {
            const eventAttendee = await EventAttendee.create({
                name: name,
                phoneNumber: phoneNumber,
                eventId: eventId
            });
            return respond.success(res, "Successfully created event attendee!", eventAttendee);
        } else {
            return respond.success(res, "Successfully gotten exisiting event attendee!", existingEventAttendee);
        }
    } catch (error) {
        console.error(error);
        return respond.error(res, "Something went wrong while creating the event attendee. Please try again later!", 500);
    }
});

router.post('/get-event-attendee', async (req, res) => {
    const eventId = req.body.eventId;
    const phoneNumber = parseInt(req.body.phoneNumber, 10);

    if (!eventId) {
        return respond.error(res, "Please provide an event id!");
    }

    if (!phoneNumber) {
        return respond.error(res, "Please provide an attendee phone number!");
    }
    
    try {
        const existingEventAttendee = await EventAttendee.getEventAttendeeByPhoneNumber(eventId, phoneNumber);
        return respond.success(res, "Successfully gotten exisiting event attendee!", existingEventAttendee ? existingEventAttendee : null);
    } catch (error) {
        console.error(error);
        return respond.error(res, "Something went wrong while creating the event attendee. Please try again later!", 500);
    }
});

router.post('/create-event-seat-reservation', async (req, res) => {
    const seatNumber = req.body.seatNumber;
    const eventId = req.body.eventId;
    const attendeeId = req.body.attendeeId

    // TODO: Validate whether seat number is valid

    if (!seatNumber) {
        return respond.error(res, "Please provide a seat number to reserve!");
    }

    if (!eventId) {
        return respond.error(res, "Please provide a event id to reserve the seat for!");
    }

    if (!attendeeId) {
        return respond.error(res, "Please provide the id of the attendee the seats belong to!");
    }

    try {
        const seatReservation = await EventReservedSeat.create({
            seatNumber: seatNumber,
            eventId: eventId,
            attendeeId: attendeeId
        });

        return respond.success(res, "Successfully created reservation!", seatReservation);
    } catch (error) {
        console.error(error);
        return respond.error(res, "Something went wrong while creating the event attendee. Please try again later!", 500);
    }
});

router.post('/sms-reservation-confirm', async (req, res) => {
    const attendeeId = req.body.attendeeId;

    if (!attendeeId) {
        return respond.error(res, "Please provide an attendee id to send the confirmation to!");
    }

    try {
        const attendee = await EventAttendee.getEventAttendeeById(attendeeId);
        const reservedSeats = await EventReservedSeat.getAttendeeReservedSeat(attendee.id);
        const event = await Event.getEventById(attendee.eventId);
        
        const message = `You have reserved ${reservedSeats.length} seat(s) (${(reservedSeats.map(a => a.seatNumber)).join(", ")}) at ${event['Venue.name']} on ${moment(event.startDateTime).format('MMMM Do YYYY, h:mm a')}.`;

        const sms = await axios.post(
            'https://sms.sit.nyp.edu.sg/SMSWebService/sms.asmx/sendMessage', 
            `SMSAccount=${process.env.SMS_USERNAME}&Pwd=${process.env.SMS_PASSWORD}&Mobile=${attendee.phoneNumber}&Message=${message}`, 
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
    
        const dataRes = XML.parse(sms.data);
    
        if (dataRes._Data == "Success") {
            return respond.success(res, "Successfully sent confirmation!");
        } else {
            return respond.error(res, "Please provide a valid eight digit mobile number!");
        }
    } catch (error) {
        console.error(error);
        return respond.error(res, "Something went wrong while getting the attendee details for sending the SMS. Please try again later!", 500);
    }
});

module.exports = router;