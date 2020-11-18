// All APIs are contained here

const express = require('express');
const moment = require('moment');
const sequelize = require('sequelize');
const router = express.Router();

const db = require('../../config/DBConfig');

const respond = require('../../utils/respond');
const auth = require('../../utils/api-auth');
const sendSMS = require('../../utils/send-sms');

const Event = require('../../models/Event');
const EventSeatType = require('../../models/EventSeatType');
const EventHelper = require('../../models/EventHelper');
const Venue = require('../../models/Venue');
const EventReservedSeat = require('../../models/EventReservedSeat');
const EventAttendee = require('../../models/EventAttendee');

router.get('/events/:id', auth.isHelper, async (req, res) => {
    const eventId = req.params.id;

    try {
        const isHelper = await EventHelper.isHelperForEvent(req.user.id, eventId);
        if (!isHelper) return respond.error(res, "The currently signed in helper is not authorised to help for this event!");

        let event = await Event.findByPk(eventId, { raw: true });
        if (!event) return respond.error(res, "Please provide a valid event ID!");

        event.seatMap = JSON.parse(event.seatMap);
        event.venue = await Venue.findByPk(event.venueId);
        event.seatTypes = await EventSeatType.getEventSeatTypes(eventId);
        event.reservedSeats = await EventReservedSeat.getEventReservedSeat(eventId);
        event.attendees = await EventAttendee.getEventAttendees(eventId);

        return respond.success(res, "Event details have been retrieved successfully!", event);
    } catch (error) {
        console.error(error);
        return respond.error(res, "Something went wrong while getting the event details. Please try again later!", 500);
    }
});

router.post('/event/reservations', auth.isHelper, async (req, res) => {
    const name = req.body.name;
    const phoneNumber = parseInt(req.body.phoneNumber, 10);
    const reservedSeats = req.body.reservedSeats;
    const noOfExtraAttendees = req.body.noOfExtraAttendees === '' ? 0 : req.body.noOfExtraAttendees;
    const eventId = req.body.eventId;

    if (!name)  return respond.error(res, "Please provide an attendee name!");
    if (!eventId) return respond.error(res, "Please provide an event id!");
    if (!phoneNumber) return respond.error(res, "Please provide an attendee phone number!");
    if (!(/^(8|9)[0-9]{7}$/.test(phoneNumber))) return respond.error(res, "Please provide a valid eight digit attendee phone number!");
    if (noOfExtraAttendees) {
        if (isNaN(noOfExtraAttendees)) return respond.error(res, "Please provide a valid number of extra attendees!");
        else if (noOfExtraAttendees < 1) return respond.error(res, "Please provide a higher number of extra attendees!");
        else if (noOfExtraAttendees > 5) return respond.error(res, "Please provide a lower number of extra attendees!");
    }

    let t = await db.transaction();

    try {
        const isHelper = await EventHelper.isHelperForEvent(req.user.id, eventId);
        if  (!isHelper) return respond.error(res, "The currently signed in helper is not authorised to help for this event!");

        let attendee = await EventAttendee.getEventAttendeeByPhoneNumber(eventId, phoneNumber);
        if (attendee) {
            await EventAttendee.update({
                noOfExtraAttendees: noOfExtraAttendees
            },{ 
                where: { id: attendee.id },
                transaction: t
            });
        } else {
            attendee = await EventAttendee.create({
                name: name,
                phoneNumber: phoneNumber,
                noOfExtraAttendees: noOfExtraAttendees,
                eventId: eventId
            },{
                transaction: t
            });
        }

        await EventReservedSeat.bulkCreate(reservedSeats.map(seatNumber => {
            return {
                seatNumber: seatNumber, 
                eventId: eventId, 
                attendeeId: attendee.id
            }
        }),{
            validate: true,
            transaction: t
        });

        await t.commit();

        return respond.success(res, "Reservation has been created successfully!", attendee);
    } catch (error) {
        await t.rollback();

        console.error(error);
        return respond.error(res, "Something went wrong while creating the reservation. Please try again later!", 500);
    } 
});

router.delete('/events/:id/extra-attendees', auth.isHelper, async (req, res) => {
    const eventId = req.params.id;

    try {
        const isHelper = await EventHelper.isHelperForEvent(req.user.id, eventId);
        if (!isHelper) return respond.error(res, "The currently signed in helper is not authorised to delete reservations for this event!");

        let attendeesWithExtraAttendees = await EventAttendee.findAll({ 
            where: {
                noOfExtraAttendees: { [sequelize.Op.not]: 0 }
            }
        });

        for (let i = 0; i < attendeesWithExtraAttendees.length; i++) {
            attendeesWithExtraAttendees[i].noOfExtraAttendees = 0;
            await attendeesWithExtraAttendees[i].save();
        }

        for (let i = 0; i < attendeesWithExtraAttendees.length; i++) {
            await sendSMS(attendeesWithExtraAttendees[i].phoneNumber, "Your entry in the waiting list has been removed because the event is fully booked.");
        }

        return respond.success(res, "Successfully deleted extra attendees from the waiting list!");
    } catch (error) {
        console.error(error);
        return respond.error(res, "Something went wrong while deleting the extra attendees. Please try again later!", 500);
    }
});

router.delete('/events/:id/seats/:seatNumber', auth.isHelper, async (req, res) => {
    const eventId = req.params.id;
    const seatNumber = req.params.seatNumber;

    try {
        const isHelper = await EventHelper.isHelperForEvent(req.user.id, eventId);
        if (!isHelper) return respond.error(res, "The currently signed in helper is not authorised to delete reservations for this event!");

        const reservedSeat = await EventReservedSeat.findOne({
            where: { 
                eventId: eventId,
                seatNumber: seatNumber

            }
        });
        if (!reservedSeat) return respond.error(res, "No reservations were found with this seat number for this event!", 404);

        reservedSeat.destroy();

        return respond.success(res, "Successfully deleted seat reservation!");
    } catch (error) {
        console.error(error);
        return respond.error(res, "Something went wrong while deleting the reservation. Please try again later!", 500);
    }
});

router.post('/sms-reservation-confirm', auth.isHelper, async (req, res) => {
    const attendeeId = req.body.attendeeId;

    if (!attendeeId) return respond.error(res, "Please provide an attendee id to send the confirmation to!");

    try {
        const attendee = await EventAttendee.getEventAttendeeById(attendeeId);
        const reservedSeats = await EventReservedSeat.getAttendeeReservedSeat(attendee.id);
        const event = await Event.getEventById(attendee.eventId);
        const message = `You have reserved ${reservedSeats.length} seat(s) (${(reservedSeats.map(a => a.seatNumber)).join(", ")}) at ${event['Venue.name']} on ${moment(event.startDateTime).format('MMMM Do YYYY, h:mm a')}.`;

        await sendSMS(attendee.phoneNumber, message);

        return respond.success(res, "SMS has been sent successfully!");
    } catch (error) {
        console.error(error);
        return respond.error(res, "Something went wrong while getting the attendee details for sending the SMS. Please try again later!", 500);
    }
});

module.exports = router;