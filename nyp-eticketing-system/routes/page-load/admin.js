// All admin's webpages are contained here

const express = require('express');
const router = express.Router();

const flash = require('../../utils/flash');
const auth = require('../../utils/check-auth');

const User = require('../../models/User');
const Venue = require('../../models/Venue');

// When creating new routes avoid using the route's name in the webpage's name
// Eg: Use router.get('/planners', ...) instead of router.get('/admin-planners', ...) cause then the url will be '/admin/admin-planners' which is super redundant
// Always keep route urls are short as possible

router.get('/', auth.isAdmin, (req, res) => {
	// Put your ejs files under your specific folder
    // Eg: Admin .ejs files should be put under the admin folder
	res.render('admin/admin-dashboard', { 
		title: "Dashboard", 
		user: req.user
	});
});

router.get('/planners', auth.isAdmin, async (req, res) => {
	var planners = await User.getPlanners();

	res.render('admin/admin-all-planners', { 
		title: "Planners", 
		user: req.user, 
		planners 
	});
});

router.post('/planners', auth.isAdmin, async (req, res) => {
	let name = req.body.name;
	let email = req.body.email;
	let password = req.body.password;

	if (!name) {
		flash.error(req, "Please enter a name!");
		return res.redirect('/admin/planners');
	}

	if (!email) {
		flash.error(req, "Please enter an email!");
		return res.redirect('/admin/planners');
	}

	var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
	if (!email.match(mailformat)) {
		flash.error(req, "Please enter a valid email!");
		return res.redirect('/admin/planners');
	}

	if (!password) {
		flash.error(req, "Please enter a password!");
		return res.redirect('/admin/planners');
	}

	let existingEmail = await User.getUserByEmail(email.toLocaleLowerCase());

	if (existingEmail) {
		flash.error(req, "This email has already been registered!");
		return res.redirect('/admin/planners');
	}

	await User.createUser({
		email: email,
		password: password,
		name: name,
		isAdmin: false,
		isPlanner: true,
		isHelper: false,
		isDeleted: false
	});

	flash.success(req, "Planner account has been successfully created!");
	return res.redirect('/admin/planners');
});

router.get('/helpers', auth.isAdmin, async(req, res) => {
	var helpers = await User.getHelpers();
	
	res.render('admin/admin-all-helpers', { 
		title: "Helpers", 
		user: req.user,
		helpers 
	});
});

router.post('/helpers', auth.isAdmin, async (req, res) => {
	let name = req.body.name;
	let email = req.body.email;
	let password = req.body.password;

	if (!name) {
		flash.error(req, "Please enter a name!");
		return res.redirect('/admin/helpers');
	}

	if (!email) {
		flash.error(req, "Please enter an email!");
		return res.redirect('/admin/helpers');
	}
	
	var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
	if (!email.match(mailformat)) {
		flash.error(req, "Please enter a valid email address!");
		return res.redirect('/admin/planners');
	}

	if (!password) {
		flash.error(req, "Please enter a password!");
		return res.redirect('/admin/helpers');
	}

	let existingEmail = await User.getUserByEmail(email.toLocaleLowerCase());

	if (existingEmail) {
		flash.error(req, "This email has already been registered!");
		return res.redirect('/admin/helpers');
	}

	await User.createUser({
		email: email,
		password: password,
		name: name,
		isAdmin: false,
		isPlanner: false,
		isHelper: true,
		isDeleted: false
	});

	flash.success(req, "Planner account has been successfully created!");
	return res.redirect('/admin/helpers');
});

// Delete function for planner accounts
router.get('/deleteplanner/:id', async (req, res) => {
	const id = req.params.id;

	await User.destroy({ where: { id: id } });

	flash.success(req, 'Successfully deleted planner account!');
	res.redirect('/admin/planners');
});

// Delete function for helper accounts
router.get('/deletehelper/:id', async (req, res) => {
	const id = req.params.id;

	await User.destroy({ where: { id: id } });

	flash.success(req, 'Successfully deleted helper account!');
	res.redirect('/admin/helpers');
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
	
	const venue = await Venue.findByPk(id);

	if (!venue) {
		flash.error(req, "That ID does not belong to any venue!");
		return res.redirect('/admin/venues');
	}
	
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