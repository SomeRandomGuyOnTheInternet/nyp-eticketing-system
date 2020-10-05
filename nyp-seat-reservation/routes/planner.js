const express = require('express');
const router = express.Router();

// Sample user object to test navigation
const user = { name: "Vignesh", isPlanner: true, isHelper: false, isAdmin: false };

router.get('/events', (req, res) => {
	res.render('planner/events', { title: "Events", user });
});

router.get('/venues', (req, res) => {
	res.render('planner/venues', { title: "Venues", user });
});


module.exports = router;