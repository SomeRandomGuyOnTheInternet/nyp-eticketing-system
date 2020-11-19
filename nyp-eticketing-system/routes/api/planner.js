// All APIs are contained here

const express = require('express');
const router = express.Router();

const sequelize = require('../../config/DBConfig');
const respond = require('../../utils/respond');
const auth = require('../../utils/api-auth');

const Event = require('../../models/Event');
const EventSeatType = require('../../models/EventSeatType');
const EventHelper = require('../../models/EventHelper');
const Venue = require('../../models/Venue');
const EventReservedSeat = require('../../models/EventReservedSeat');
const User = require('../../models/User');

// Gets all helpers to allow planners to choose event helpers
router.get('/helpers', auth.isPlanner, async (req, res) => {
    try {
        const helpers = await User.getHelpers();

        return respond.success(res, "All helpers have been retrieved successfully!", helpers);
    } catch (error) {
        console.error(error);
        return respond.error(res, "Something went wrong while getting all helpers!", 500);
    }
});

// Get venues for planners to choose which venue to use when creating a event
router.get('/venues', auth.isPlanner, async (req, res) => {
    try {
        let venues = await Venue.findAll({ order: [['name', 'ASC']] });

        venues.forEach(v => v.seatMap = JSON.parse(v.seatMap));

        return respond.success(res, "All venues have been retrieved successfully!", venues);
    } catch (error) {
        console.error(error);
        return respond.error(res, "Something went wrong while getting all venues!", 500);
    }
});

// Get events by specific events id to view event details 
router.get('/events/:id', auth.isPlanner, async (req, res) => {
    const eventId = req.params.id;

    try {
        // Check if the event id is valid and tied to the right event details 
        let event = await Event.findByPk(eventId, { raw: true });
        if (!event) return respond.error(res, "Please provide a valid event ID!");

        event.seatMap = JSON.parse(event.seatMap);
        event.venue = await Venue.findByPk(event.venueId);
        event.seatTypes = await EventSeatType.getEventSeatTypes(eventId);
        event.reservedSeats = await EventReservedSeat.getEventReservedSeat(eventId);
        event.helpers = await EventHelper.getHelpersByEventId(eventId);

        return respond.success(res, "Event details have been retrieved successfully!", event);
    } catch (error) {
        console.error(error);
        return respond.error(res, "Something went wrong while getting the event details. Please try again later!", 500);
    }
});

// Create of events
router.post('/events', auth.isPlanner, async (req, res) => {
    const name = req.body.name;
    const seatMap = JSON.stringify(req.body.seatMap);
    const startDateTime = req.body.startDateTime;
    const seatsPerReservation = req.body.seatsPerReservation === '' ? null : req.body.seatsPerReservation;
    const prioritiseBackRows = req.body.prioritiseBackRows;
    const noOfReservableSeats = req.body.noOfReservableSeats;
    const fullyBookedMessage = req.body.fullyBookedMessage === '' ? null : req.body.fullyBookedMessage;
    const venueId = req.body.venueId;
    const seatTypes = req.body.seatTypes;
    const eventHelpers = req.body.eventHelpers;

    // Check if the valid event id is provided 
    if (!venueId) return respond.error(res, "Please provide a valid id for the venue!");
    // Check if a event name is provided
    if (!name) return respond.error(res, "Please provide a event name!");
    // Check if a venue is selected for the event
    if (!seatMap) return respond.error(res, "Please provide a seat map for the event!");
    // Check if a valid date time is provided
    if (!startDateTime) return respond.error(res, "Please provide a valid start date/time for the event!");
    // Check if the custom message exist or provided
    if (!fullyBookedMessage) return respond.error(res, "Please provide a message to be sent to attendees in the waiting list to notify them about the event being fully booked!");
    // Check if the number of reserved seats is a number 
    if (isNaN(noOfReservableSeats)) return respond.error(res, "Please provide a valid number of reservable seats for this event!");
    // Check if the number of reserved seats is lower or higher than the limit of reservable seats for the events 
    if (noOfReservableSeats < 0) return respond.error(res, "Please provide a higher number of reservable seats for this event!");
    if (noOfReservableSeats > 2000) return respond.error(res, "Please provide a lower number of reservable seats for this event!");
    // Check if the seats per reservations is null, if not null then check the number 
    if (seatsPerReservation) {
        if (isNaN(seatsPerReservation)) return respond.error(res, "Please provide a valid max number of seats per reservation!");
        else if (seatsPerReservation < 1) return respond.error(res, "Please provide a higher number of seats per reservation!");
        else if (seatsPerReservation > 10) return respond.error(res, "Please provide a lower number of seats per reservation!");
    }

    const parsedDateTime = Date.parse(startDateTime);
    const maxDate = new Date().setFullYear(new Date().getFullYear() + 5);
    const minDate = new Date().setFullYear(new Date().getFullYear() - 5);

    // Check if the data and time is valid 
    if (isNaN(parsedDateTime)) return respond.error(res, "Please provide a valid start date/time for the event!");
    if (parsedDateTime > maxDate) return respond.error(res, "Please provide a lower start date/time for the event!");
    if (parsedDateTime < minDate) return respond.error(res, "Please provide a higher start date/time for the event!");

    let t = await sequelize.transaction();

    try {
        // Connects to sequalise and creates the event in the database
        const newEvent = await Event.create({
            name: name,
            seatMap: seatMap,
            startDateTime: startDateTime,
            seatsPerReservation: seatsPerReservation,
            prioritiseBackRows: prioritiseBackRows,
            noOfReservableSeats: noOfReservableSeats,
            fullyBookedMessage: fullyBookedMessage,
            venueId: venueId
        },{
            transaction: t
        });

        // Assigning of event id to each seat types
        seatTypes.forEach(s => s.eventId = newEvent.id);
        eventHelpers.forEach(h => h.eventId = newEvent.id);

        // Connects to sequalise and creates the seat type in the database
        await EventSeatType.bulkCreate(seatTypes, {
            validate: true,
            transaction: t
        });
        // Connects to sequalise and creates the event helpers in the database
        await EventHelper.bulkCreate(eventHelpers, {
            validate: true,
            transaction: t
        });
        
        await t.commit();

        return respond.success(res, "A new event has been created successfully!");
    } catch (error) {
        await t.rollback();

        console.error(error);
        return respond.error(res, "Something went wrong while creating this event. Please try again later!", 500);
    }
});

// Update of events based on speific event id
router.put('/events/:id', auth.isPlanner, async (req, res) => {
    const eventId = req.params.id;

    const name = req.body.name;
    const seatMap = JSON.stringify(req.body.seatMap);
    const startDateTime = req.body.startDateTime;
    const seatsPerReservation = req.body.seatsPerReservation === '' ? null : req.body.seatsPerReservation;
    const prioritiseBackRows = req.body.prioritiseBackRows;
    const noOfReservableSeats = req.body.noOfReservableSeats;
    const fullyBookedMessage = req.body.fullyBookedMessage === '' ? null : req.body.fullyBookedMessage;
    const venueId = req.body.venueId;
    const seatTypes = req.body.seatTypes;
    const eventHelpers = req.body.eventHelpers;

    // Check if the valid venue id is provided 
    if (!venueId) return respond.error(res, "Please provide a valid id for the venue!");
    // Check if a event name is provided
    if (!name) return respond.error(res, "Please provide a event name!");
    // Check if a venue is selected for the event
    if (!seatMap) return respond.error(res, "Please provide a seat map for the event!");
    // Check if a valid date time is provided
    if (!startDateTime) return respond.error(res, "Please provide a valid start date/time for the event!");
    // Check if the custom message exist or provided
    if (!fullyBookedMessage) return respond.error(res, "Please provide a message to be sent to attendees in the waiting list to notify them about the event being fully booked!");
    // Check if the number of reserved seats is a number
    if (isNaN(noOfReservableSeats)) return respond.error(res, "Please provide a valid number of reservable seats for this event!");
    // Check if the number of reserved seats is lower or higher than the limit of reservable seats for the events 
    if (noOfReservableSeats < 0) return respond.error(res, "Please provide a higher number of reservable seats for this event!");
    if (noOfReservableSeats > 2000) return respond.error(res, "Please provide a lower number of reservable seats for this event!");
    // Check if the seats per reservations is null, if not null then check the number 
    if (seatsPerReservation) {
        if (isNaN(seatsPerReservation)) return respond.error(res, "Please provide a valid max number of seats per reservation!");
        else if (seatsPerReservation < 1) return respond.error(res, "Please provide a higher number of seats per reservation!");
        else if (seatsPerReservation > 10) return respond.error(res, "Please provide a lower number of seats per reservation!");
    }

    const parsedDateTime = Date.parse(startDateTime);
    const maxDate = new Date().setFullYear(new Date().getFullYear() + 5);
    const minDate = new Date().setFullYear(new Date().getFullYear() - 5);

    // Check if the date and time is valid
    if (isNaN(parsedDateTime)) return respond.error(res, "Please provide a valid start date/time for the event!");
    if (parsedDateTime > maxDate) return respond.error(res, "Please provide a lower start date/time for the event!");
    if (parsedDateTime < minDate) return respond.error(res, "Please provide a higher start date/time for the event!");

    // Assigning of event id to each seat types
    seatTypes.forEach(s => s.eventId = eventId);
    eventHelpers.forEach(h => h.eventId = eventId);

    let t = await sequelize.transaction();

    try {
        // Connects to sequalise and updates the events in the database
        await Event.update(
			{
                name: name,
                seatMap: seatMap,
                startDateTime: startDateTime,
                seatsPerReservation: seatsPerReservation,
                prioritiseBackRows: prioritiseBackRows,
                noOfReservableSeats: noOfReservableSeats,
                fullyBookedMessage: fullyBookedMessage,
                venueId: venueId
            },
            { 
                where: { id: eventId },
                transaction: t
            },
        );
        
        // Connects to sequalise and delete all event seat types and recreate them
        await EventSeatType.destroy({ where: { eventId: eventId }, transaction: t });
        await EventSeatType.bulkCreate(seatTypes, {
            validate: true,
            transaction: t
        });

        // Connects to sequalise and delete all event helpers tied with the events and recreate them
        await EventHelper.destroy({ where: { eventId: eventId }, transaction: t });
        await EventHelper.bulkCreate(eventHelpers, {
            validate: true,
            transaction: t
        });
        
        await t.commit();

        return respond.success(res, "The event has been updated successfully!");
    } catch (error) {
        await t.rollback();

        console.error(error);
        return respond.error(res, "Something went wrong while updating this event. Please try again later!", 500);
    }
});

// Delete of events by events id
router.delete('/events/:id', auth.isPlanner, async (req, res) => {
    const id = req.params.id;

    let t = await sequelize.transaction();
    
    try {
        await Event.destroy({ where: { id: id }, transaction: t });
        await EventSeatType.destroy({ where: { eventId: id }, transaction: t });
        await EventReservedSeat.destroy({ where: { eventId: id }, transaction: t });
        await EventHelper.destroy({ where: { eventId: id }, transaction: t });

        await t.commit();

        return respond.success(res, "The event has been deleted successfully!");
    } catch (error) {        
        await t.rollback();

        console.error(error);
        return respond.error(res, "Something went wrong while deleting this event!", 500);
    }
});

// Get all reservations for particular events based on event id 
router.get('/events/:id/reservations', auth.isPlanner, async (req, res) => {
    const eventId = req.params.id;

    try {
        // Check if the event id is correct 
        let event = await Event.findByPk(eventId, { raw: true });
        if (!event) return respond.error(res, "Please provide a valid event ID!");
        
        const reservation = await EventReservedSeat.getEventReservedSeat(eventId);

        return respond.success(res, "Event reservations have been retrieved successfully!", reservation);
    } catch (error) {
        console.error(error);
        return respond.error(res, "Something went wrong while getting the event reservations. Please try again later!", 500);
    }
});

module.exports = router;