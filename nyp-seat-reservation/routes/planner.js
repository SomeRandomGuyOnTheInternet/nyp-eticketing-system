// All planner's webpages are contained here

const express = require('express');
const router = express.Router();

const flash = require('../utils/flash');

// Sample user object to test navigation
// For the planner pages, this user is a planner
const user = { name: "Vignesh", isPlanner: true, isHelper: false, isAdmin: false };

// When creating new routes avoid using the route's name in the webpage's name
// Eg: Use router.get('/events', ...) instead of router.get('/planner-events', ...) cause then the url will be '/planner/planner-events' which is super redundant
// Always keep route urls are short as possible

router.get('/events', (req, res) => {
    // Put your ejs files under your specific folder
    // Eg: Admin .ejs files should be put under the admin folder
	res.render('planner/planner-all-events', { title: "Events", user }); // We pass the user object contructed above to the ejs so it can show the appropriate navbar details and other stuff
});

router.get('/add-event', (req, res) => {
	res.render('planner/planner-add-event', { title: "Add Event", user });
});

router.get('/venues', (req, res) => {
	res.render('planner/planner-all-venues', { title: "Venues", user });
});

module.exports = router;