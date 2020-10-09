// All admin's webpages are contained here

const express = require('express');
const User = require('../models/User');
const router = express.Router();

const flash = require('../utils/flash');

// Sample user object to test navigation
// For the planner pages, this user is a admin
const user = { name: "Administrator", isPlanner: false, isHelper: false, isAdmin: true };

// When creating new routes avoid using the route's name in the webpage's name
// Eg: Use router.get('/planners', ...) instead of router.get('/admin-planners', ...) cause then the url will be '/admin/admin-planners' which is super redundant
// Always keep route urls are short as possible

router.get('/', checkNotAuthenticated, (req, res) => {
	// Put your ejs files under your specific folder
    // Eg: Admin .ejs files should be put under the admin folder
	res.render('admin/admin-dashboard', { title: "Dashboard", user }); // We pass the user object contructed above to the ejs so it can show the appropriate navbar details and other stuff
});

router.get('/planners', checkNotAuthenticated, async (req, res) => {
	var planners = await User.getPlanners();
	res.render('admin/admin-all-planners', { title: "Planners", user, planners })
});

router.post('/planners', checkNotAuthenticated, async (req, res) => {
	let name = req.body.name;
	let email = req.body.email;
	let password = req.body.password;

	if (!name) {
		flash.error(req, "Please enter a name!")
		res.redirect('/admin/planners');
		return;
	}

	if (!email) {
		flash.error(req, "Please enter an email!")
		res.redirect('/admin/planners');
		return;
	}

	if (!password) {
		flash.error(req, "Please enter a password!")
		res.redirect('/admin/planners');
		return;
	}

	let existingEmail = await User.getUserByEmail(email.toLocaleLowerCase());

	if (existingEmail) {
		flash.error(req, "This email has already been registered!");
		res.redirect('/admin/planners');
		return;
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

	flash.success(req, "Planner account has been successfully created!")
	res.redirect('/admin/planners');
	return;
});

router.get('/helpers', checkNotAuthenticated, async(req, res) => {
	var helpers = await User.getHelpers();
	res.render('admin/admin-all-helpers', { title: "Helpers", user, helpers })
});

router.post('/helpers', checkNotAuthenticated, async (req, res) => {
	let name = req.body.name;
	let email = req.body.email;
	let password = req.body.password;

	if (!name) {
		flash.error(req, "Please enter a name!")
		res.redirect('/admin/helpers');
		return;
	}

	if (!email) {
		flash.error(req, "Please enter an email!")
		res.redirect('/admin/helpers');
		return;
	}

	if (!password) {
		flash.error(req, "Please enter a password!")
		res.redirect('/admin/helpers');
		return;
	}

	let existingEmail = await User.getUserByEmail(email.toLocaleLowerCase());

	if (existingEmail) {
		flash.error(req, "This email has already been registered!");
		res.redirect('/admin/helpers');
		return;
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

	flash.success(req, "Planner account has been successfully created!")
	res.redirect('/admin/helpers');
	return;
});

function checkNotAuthenticated(req, res, next) {
	if (!req.user) {
		if (!req.user.isAdmin) {
			return res.redirect('/');
		}

		return res.redirect('/');
	}

	next();
};

module.exports = router;