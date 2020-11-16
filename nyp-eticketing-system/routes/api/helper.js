// All APIs are contained here

const express = require('express');
const axios = require('axios');
const moment = require('moment');
const XML = require('pixl-xml');
const router = express.Router();

const sequelize = require('../../config/DBConfig');

const respond = require('../../utils/respond');
const auth = require('../../utils/api-auth');

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

    let t = await sequelize.transaction();

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

router.put('/event/reservations/:id', auth.isHelper, async (req, res) => {
    const attendeeId = req.params.id;
    
    const name = req.body.name;
    const phoneNumber = parseInt(req.body.phoneNumber, 10);
    const noOfExtraAttendees = req.body.noOfExtraAttendees === '' ? 0 : req.body.noOfExtraAttendees;
    const reservedSeats = req.body.reservedSeats;
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

    let t = await sequelize.transaction();

    try {
        const isHelper = await EventHelper.isHelperForEvent(req.user.id, eventId);
        if  (!isHelper) return respond.error(res, "The currently signed in helper is not authorised to help for this event!");

        await EventAttendee.update({
            name: name,
            phoneNumber: phoneNumber,
            noOfExtraAttendees: noOfExtraAttendees
        },{ 
            where: { id: attendeeId },
            transaction: t
        });

        await EventReservedSeat.destroy({ where: { attendeeId: attendeeId }, transaction: t });
        await EventReservedSeat.bulkCreate(reservedSeats.map(seatNumber => {
            return {
                seatNumber: seatNumber, 
                eventId: eventId, 
                attendeeId: attendeeId
            }
        }),{
            validate: true,
            transaction: t
        });

        await t.commit();

        return respond.success(res, "Reservation has been updated successfully!", attendee);
    } catch (error) {
        await t.rollback();

        console.error(error);
        return respond.error(res, "Something went wrong while updating the reservation. Please try again later!", 500);
    }
});

router.post('/sms-reservation-confirm', auth.isHelper, async (req, res) => {
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
    
        if (dataRes._Data === "Success") {
            return respond.success(res, "Successfully sent confirmation!");
        } else {
            console.error(dataRes._Data)
            return respond.error(res, "Please provide a valid eight digit mobile number!");
        }
    } catch (error) {
        console.error(error);
        return respond.error(res, "Something went wrong while getting the attendee details for sending the SMS. Please try again later!", 500);
    }
});


router.post('/event/attendees', auth.isHelper, async (req, res) => {
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
    
        if (dataRes._Data === "Success") {
            return respond.success(res, "Successfully sent confirmation!");
        } else {
            console.error(dataRes._Data)
            return respond.error(res, "Please provide a valid eight digit mobile number!");
        }
    } catch (error) {
        console.error(error);
        return respond.error(res, "Something went wrong while getting the attendee details for sending the SMS. Please try again later!", 500);
    }
});

module.exports = router;