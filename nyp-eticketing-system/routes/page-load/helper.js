// TODO: show message if html table contains no rows

// All helper's webpages are contained here

const express = require('express');
const router = express.Router();

const flash = require('../../utils/flash');
const auth = require('../../utils/page-load-auth');

const EventHelper = require('../../models/EventHelper');
const Event = require('../../models/Event');

// When creating new routes avoid using the route's name in the webpage's name
// Eg: Use router.get('/venues', ...) instead of router.get('/helper-venues', ...) cause then the url will be '/helper/helper-venues' which is super redundant
// Always keep route urls are short as possible

router.get('/', auth.isHelper, async (req, res) => {
    // Put your ejs files under your specific folder
	// Eg: Admin .ejs files should be put under the admin folder
	const events = await EventHelper.getEventsByHelperId(req.user.id);

	res.render('helper/helper-all-events', { 
		title: "Events", 
		user: req.user,
		events: events
	});
});

router.get('/events/:id', auth.isHelper, async (req, res) => {
	const eventId = req.params.id;
	const isHelper = await EventHelper.isHelperForEvent(req.user.id, eventId);

	if (!isHelper) {
		flash.error(req, "You are not assigned that event!");
		res.redirect('/planner/events');
		return;
	}

	const event = await Event.getEventById(eventId);

	if (!event) {
		flash.error(req, "That ID does not belong to any event!");
		res.redirect('/planner/events');
		return;
	}

	res.render('helper/helper-view-event', { 
		title: event.name, 
		user: req.user,
		event: event,
	});
});

module.exports = router;