// All planner's webpages are contained here

const express = require('express');
const router = express.Router();

const flash = require('../utils/flash');
const auth = require('../utils/check-auth');

// Sample user object to test navigation
// For the planner pages, this user is a planner

// When creating new routes avoid using the route's name in the webpage's name
// Eg: Use router.get('/events', ...) instead of router.get('/planner-events', ...) cause then the url will be '/planner/planner-events' which is super redundant
// Always keep route urls are short as possible

router.get('/events', auth.isPlanner, (req, res) => {
    // Put your ejs files under your specific folder
    // Eg: Admin .ejs files should be put under the admin folder
	res.render('planner/planner-all-events', { 
		title: "Events", 
		user: req.user 
	});
});

router.get('/add-event', auth.isPlanner, (req, res) => {
	res.render('planner/planner-add-event', { 
		title: "Add Event", 
		user: req.user  
	});
});

router.get('/venues', auth.isPlanner, (req, res) => {
	res.render('planner/planner-all-venues', { 
		title: "Venues", 
		user: req.user 
	});
});

router.get('/add-venue', auth.isPlanner, (req, res) => {
	res.render('planner/planner-add-venue', { 
		title: "Add Venue", 
		user: req.user  
	});
});

module.exports = router;