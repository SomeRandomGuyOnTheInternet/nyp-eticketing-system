// All planner's webpages are contained here

// TODO: When deleting venues, delete any events that take place in them as well

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

module.exports = router;