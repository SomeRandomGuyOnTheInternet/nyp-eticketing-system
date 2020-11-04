// All planner's webpages are contained here

// TODO: Check whether seats in event or venue are already taken before editing them
// TODO: When deleting venues, delete any events that take place in them as well
// TODO: Show loading screen when loading map

const express = require('express');
const router = express.Router();

const flash = require('../../utils/flash');
const auth = require('../../utils/page-load-auth');

const Venue = require('../../models/Venue');
const Event = require('../../models/Event');

// Sample user object to test navigation
// For the planner pages, this user is a planner

// When creating new routes avoid using the route's name in the webpage's name
// Eg: Use router.get('/events', ...) instead of router.get('/planner-events', ...) cause then the url will be '/planner/planner-events' which is super redundant
// Always keep route urls are short as possible

router.get('/events', auth.isPlanner, async (req, res) => {
    // Put your ejs files under your specific folder
	// Eg: Planner .ejs files should be put under the planner folder
	const events = await Event.getAllEvents();

	res.render('planner/planner-all-events', { 
		title: "Events", 
		user: req.user,
		events: events,
	});
});

router.get('/events/:id', auth.isPlanner, async (req, res) => {
	const id = req.params.id;
	const event = await Event.getEventById(id);

	if (!event) {
		flash.error(req, "That ID does not belong to any event!");
		return res.redirect('/planner/events');
	}

	res.render('planner/planner-edit-event', { 
		title: event.name, 
		user: req.user,
		event: event,
	});
});

router.get('/add-event', auth.isPlanner, async (req, res) => {
	res.render('planner/planner-add-event', { 
		title: "Add Event", 
		user: req.user  
	});
});

// ---

router.get('/events/:eventId', auth.isPlanner, async (req, res) => {
    const eventId = req.params.eventId;

    if (!eventId) {
        return ajax.error(res, "Please enter a valid id for the venue!");
    }

    try {
        let event = await Event.getEventById(eventId);
        event.seatTypes = await EventSeatType.getEventSeatTypes(eventId);
        event.reservedSeats = await EventReservedSeat.getEventReservedSeat(eventId);
        event.venue = await Venue.getVenueById(event.venueId);
        event.helpers = await EventHelper.getHelpersByEventId(eventId);

        return ajax.success(res, "Successfully gotten event details!", event);
    } catch (error) {
        console.error(error);
        return ajax.error(res, "Something went wrong while getting the event details. Please try again later!", 500);
    }
});

router.post('/add-event', auth.isPlanner, async (req, res) => {
    const name = req.body.name;
    const seatMap = JSON.stringify(req.body.seatMap);
    const startDateTime = req.body.startDateTime;
    const prioritiseBackRows = req.body.prioritiseBackRows;
    const seatsPerReservation = req.body.seatsPerReservation == '' ? null : req.body.seatsPerReservation;
    const venueId = req.body.venueId == '' ? null : req.body.venueId;

    if (!name) {
        return ajax.error(res, "Please enter a event name!");
    }

    if (!seatMap) {
        return ajax.error(res, "Please enter a seat map for the event!");
    }

    if (!startDateTime) {
        return ajax.error(res, "Please enter a valid start date/time for the event!");
    }

    if (seatsPerReservation) {
        if (isNaN(seatsPerReservation)) {
            return ajax.error(res, "Please enter a valid max number of seats per reservation!");
        } else {
            if (seatsPerReservation < 1) {
                return ajax.error(res, "Please enter a higher number of seats per reservation!");
            }

            if (seatsPerReservation > 10) {
                return ajax.error(res, "Please enter a lower number of seats per reservation!");
            }
        }
    }

    if (!venueId) {
        return ajax.error(res, "Please enter a valid id for the venue!");
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
        
        return ajax.success(res, "Successfully created event!", event);
    } catch (error) {
        console.error(error);
        return ajax.error(res, "Something went wrong while creating this event. Please try again later!", 500);
    }
});

router.post('/events/update', auth.isPlanner, async (req, res) => {
    const eventId = req.body.eventId;
    const name = req.body.name;
    const seatMap = JSON.stringify(req.body.seatMap);
    const startDateTime = req.body.startDateTime;
    const prioritiseBackRows = req.body.prioritiseBackRows;
    const seatsPerReservation = req.body.seatsPerReservation == '' ? null : req.body.seatsPerReservation;
    const venueId = req.body.venueId == '' ? null : req.body.venueId;
    
    if (!eventId) {
        return ajax.error(res, "Please provide an event id!");
    }

    if (!name) {
        return ajax.error(res, "Please enter a event name!");
    }

    if (!seatMap) {
        return ajax.error(res, "Please enter a seat map for the event!");
    }

    if (!startDateTime) {
        return ajax.error(res, "Please enter a valid start date/time for the event!");
    }

    if (seatsPerReservation) {
        if (isNaN(seatsPerReservation)) {
            return ajax.error(res, "Please enter a valid max number of seats per reservation!");
        } else {
            if (seatsPerReservation < 1) {
                return ajax.error(res, "Please enter a higher number of seats per reservation!");
            }

            if (seatsPerReservation > 10) {
                return ajax.error(res, "Please enter a lower number of seats per reservation!");
            }
        }
    }

    if (!venueId) {
        return ajax.error(res, "Please enter a valid id for the venue!");
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
        
        return ajax.success(res, "Successfully created event!", event);
    } catch (error) {
        console.error(error);
        return ajax.error(res, "Something went wrong while updating this event. Please try again later!", 500);
    }
});

module.exports = router;