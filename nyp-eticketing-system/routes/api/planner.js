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

router.get('/helpers', auth.isPlanner, async (req, res) => {
    try {
        const helpers = await User.getHelpers();

        return respond.success(res, "All helpers have been retrieved successfully!", helpers);
    } catch (error) {
        console.error(error);
        return respond.error(res, "Something went wrong while getting all helpers!", 500);
    }
});

router.get('/venues', auth.isPlanner, async (req, res) => {
    try {
        let venues = await Venue.findAll({
            order: [['name', 'ASC']]
        });

        venues.forEach(v => v.seatMap = JSON.parse(v.seatMap));

        return respond.success(res, "All venues have been retrieved successfully!", venues);
    } catch (error) {
        console.error(error);
        return respond.error(res, "Something went wrong while getting all venues!", 500);
    }
});

router.get('/events/:id', auth.isPlanner, async (req, res) => {
    const eventId = req.params.id;

    try {
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

router.post('/events', auth.isPlanner, async (req, res) => {
    const name = req.body.name;
    const seatMap = JSON.stringify(req.body.seatMap);
    const startDateTime = req.body.startDateTime;
    const seatsPerReservation = req.body.seatsPerReservation == '' ? null : req.body.seatsPerReservation;
    const prioritiseBackRows = req.body.prioritiseBackRows;
    const venueId = req.body.venueId;
    const seatTypes = req.body.seatTypes;
    const eventHelpers = req.body.eventHelpers;

    if (!venueId) return respond.error(res, "Please provide a valid id for the venue!");
    if (!name) return respond.error(res, "Please provide a event name!");
    if (!seatMap) return respond.error(res, "Please provide a seat map for the event!");
    if (!startDateTime) return respond.error(res, "Please provide a valid start date/time for the event!");
    if (seatsPerReservation) {
        if (isNaN(seatsPerReservation)) return respond.error(res, "Please provide a valid max number of seats per reservation!");
        else if (seatsPerReservation < 1) return respond.error(res, "Please provide a higher number of seats per reservation!");
        else if (seatsPerReservation > 10) return respond.error(res, "Please provide a lower number of seats per reservation!");
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

        seatTypes.forEach(s => s.eventId = newEvent.id);
        eventHelpers.forEach(h => h.eventId = newEvent.id);

        await EventSeatType.bulkCreate(seatTypes, {
            validate: true,
            transaction: t
        });
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

router.put('/events/:id', auth.isPlanner, async (req, res) => {
    const eventId = req.params.id;

    const name = req.body.name;
    const seatMap = JSON.stringify(req.body.seatMap);
    const startDateTime = req.body.startDateTime;
    const seatsPerReservation = req.body.seatsPerReservation == '' ? null : req.body.seatsPerReservation;
    const prioritiseBackRows = req.body.prioritiseBackRows;
    const venueId = req.body.venueId;
    const seatTypes = req.body.seatTypes;
    const eventHelpers = req.body.eventHelpers;

    if (!venueId) return respond.error(res, "Please provide a valid id for the venue!");
    if (!name) return respond.error(res, "Please provide a event name!");
    if (!seatMap) return respond.error(res, "Please provide a seat map for the event!");
    if (!startDateTime) return respond.error(res, "Please provide a valid start date/time for the event!");
    if (seatsPerReservation) {
        if (isNaN(seatsPerReservation)) return respond.error(res, "Please provide a valid max number of seats per reservation!");
        else if (seatsPerReservation < 1) return respond.error(res, "Please provide a higher number of seats per reservation!");
        else if (seatsPerReservation > 10) return respond.error(res, "Please provide a lower number of seats per reservation!");
    }

    seatTypes.forEach(s => s.eventId = eventId);
    eventHelpers.forEach(h => h.eventId = eventId);

    let t = await sequelize.transaction();

    try {
        await Event.update(
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
                },
                transaction: t
            },
        );

        await EventSeatType.destroy({ where: { eventId: eventId }, transaction: t });
        await EventSeatType.bulkCreate(seatTypes, {
            validate: true,
            transaction: t
        });

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

module.exports = router;