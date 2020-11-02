// All APIs are contained here

const express = require('express');
const router = express.Router();

const ajax = require('../../utils/status');
const auth = require('../../utils/api-auth');

const Event = require('../../models/Event');
const EventSeatType = require('../../models/EventSeatType');
const EventHelper = require('../../models/EventHelper');
const Venue = require('../../models/Venue');
const EventReservedSeat = require('../../models/EventReservedSeat');
const User = require('../../models/User');


router.get('/venues', auth.isPlanner, async (req, res) => {
    try {
        const venues = await Venue.findAll({
            order: [['name', 'ASC']]
        });

        return ajax.success(res, "Successfully gotten all venues!", venues);
    } catch (error) {
        console.error(error);
        return ajax.error(res, "Something went wrong while getting all venues!", 500);
    }
});

router.get('/events/:id', auth.isPlanner, async (req, res) => {
    const eventId = req.params.id;

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

router.post('/events', auth.isPlanner, async (req, res) => {
    const name = req.body.name;
    const seatMap = JSON.stringify(req.body.seatMap);
    const startDateTime = req.body.startDateTime;
    const seatsPerReservation = req.body.seatsPerReservation;
    const prioritiseBackRows = req.body.prioritiseBackRows;
    const venueId = req.body.venueId;
    const seatTypes = req.body.seatTypes;
    const eventHelpers = req.body.helpers;

    if (!venueId) return ajax.error(res, "Please enter a valid id for the venue!");
    if (!name) return ajax.error(res, "Please enter a event name!");
    if (!seatMap) return ajax.error(res, "Please enter a seat map for the event!");
    if (!startDateTime) return ajax.error(res, "Please enter a valid start date/time for the event!");
    if (seatsPerReservation) {
        if (isNaN(seatsPerReservation)) return ajax.error(res, "Please enter a valid max number of seats per reservation!");
        else if (seatsPerReservation < 1) return ajax.error(res, "Please enter a higher number of seats per reservation!");
        else if (seatsPerReservation > 10) return ajax.error(res, "Please enter a lower number of seats per reservation!");
    }

    let t = await sequelize.transaction();

    try {
        const newEvent = await Event.create({
            name: name,
            seatMap: seatMap,
            startDateTime: startDateTime,
            seatsPerReservation: seatsPerReservation,
            prioritiseBackRows: prioritiseBackRows,
            venueId: venueId
        },{
            transaction: t
        });  
        const newSeatTypes = await EventSeatType.bulkCreate(seatTypes, {
            validate: true,
            transaction: t
        });
        const newEventHelpers = await EventHelper.bulkCreate(eventHelpers, {
            validate: true,
            transaction: t
        });
        
        await t.commit();

        return ajax.success(res, "Successfully created event!", event);
    } catch (error) {
        await t.rollback();

        console.error(error);
        return ajax.error(res, "Something went wrong while creating this event. Please try again later!", 500);
    }
});

router.put('/events/:id', auth.isPlanner, async (req, res) => {
    const eventId = req.body.eventId;
    const name = req.body.name;
    const seatMap = JSON.stringify(req.body.seatMap);
    const startDateTime = req.body.startDateTime;
    const prioritiseBackRows = req.body.prioritiseBackRows;
    const seatsPerReservation = req.body.seatsPerReservation == '' ? null : req.body.seatsPerReservation;
    const venueId = req.body.venueId == '' ? null : req.body.venueId;
    
    if (!venueId) return ajax.error(res, "Please enter a valid id for the venue!");
    if (!name) return ajax.error(res, "Please enter a event name!");
    if (!seatMap) return ajax.error(res, "Please enter a seat map for the event!");
    if (!startDateTime) return ajax.error(res, "Please enter a valid start date/time for the event!");
    if (seatsPerReservation) {
        if (isNaN(seatsPerReservation)) return ajax.error(res, "Please enter a valid max number of seats per reservation!");
        else if (seatsPerReservation < 1) return ajax.error(res, "Please enter a higher number of seats per reservation!");
        else if (seatsPerReservation > 10) return ajax.error(res, "Please enter a lower number of seats per reservation!");
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

router.get('/helpers', auth.isPlanner, async (req, res) => {
    try {
        const helpers = await User.getHelpers();

        return ajax.success(res, "Successfully gotten all helpers!", helpers);
    } catch (error) {
        console.error(error);
        return ajax.error(res, "Something went wrong while getting all helpers!", 500);
    }
});

module.exports = router;