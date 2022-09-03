// All admin's webpages are contained here

const express = require('express');
const router = express.Router();

const flash = require('../../utils/flash');
const auth = require('../../utils/page-load-auth');

const User = require('../../models/User');
const Venue = require('../../models/Venue');

// When creating new routes avoid using the route's name in the webpage's name
// Eg: Use router.get('/planners', ...) instead of router.get('/admin-planners', ...) cause then the url will be '/admin/admin-planners' which is super redundant
// Always keep route urls are short as possible

// This is where all the pages are rendered for the speific routes 

router.get('/planners', auth.isAdmin, async (req, res) => {
	var planners = await User.getPlanners();

	res.render('admin/admin-all-planners', { 
		title: "Planners", 
		user: req.user, 
		planners 
	});
});

router.get('/helpers', auth.isAdmin, async(req, res) => {
	var helpers = await User.getHelpers();
	
	res.render('admin/admin-all-helpers', { 
		title: "Helpers", 
		user: req.user,
		helpers 
	});
});


router.get('/venues', auth.isAdmin, async (req, res) => {
	const venues = await Venue.getAllVenues();

	res.render('admin/admin-all-venues', { 
		title: "Venues", 
		user: req.user,
		venues: venues,
	});
});

router.get('/venues/:id', auth.isAdmin, async (req, res) => {
	const id = req.params.id;
	
	let venue = await Venue.findByPk(id);

	if (!venue) {
		flash.error(req, "That ID does not belong to any venue!");
		return res.redirect('/admin/venues');
	}

	venue.seatMap = JSON.parse(venue.seatMap);
	
	res.render('admin/admin-edit-venue', { 
		title: venue.name, 
		user: req.user,
		venue: venue,
	});
});

router.get('/add-venue', auth.isAdmin, async (req, res) => {
	res.render('admin/admin-add-venue', { 
		title: "Add Venue", 
		user: req.user  
	});
});

module.exports = router;