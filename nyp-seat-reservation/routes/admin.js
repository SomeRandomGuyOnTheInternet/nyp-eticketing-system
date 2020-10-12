// All admin's webpages are contained here

const express = require('express');
const User = require('../models/User');
const router = express.Router();

const flash = require('../utils/flash');
const auth = require('../utils/check-auth');

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
		res.redirect('/admin/planners');
		return;
	}

	if (!email) {
		flash.error(req, "Please enter an email!");
		res.redirect('/admin/planners');
		return;
	}

	if (!password) {
		flash.error(req, "Please enter a password!");
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

	flash.success(req, "Planner account has been successfully created!");
	res.redirect('/admin/planners');
	return;
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
		res.redirect('/admin/helpers');
		return;
	}

	if (!email) {
		flash.error(req, "Please enter an email!");
		res.redirect('/admin/helpers');
		return;
	}

	if (!password) {
		flash.error(req, "Please enter a password!");
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

	flash.success(req, "Planner account has been successfully created!");
	res.redirect('/admin/helpers');
	return;
});

//Delete function for planner accounts
router.get('/deleteplanner/:id', async (req, res) => {
	const id = req.params.id;
	await User.deleteuSers(id);
	flash.success(req, 'Successfully deleted planner account');
	res.redirect('/admin/planners');
});

//Delete function for helper accounts
router.get('/deletehelper/:id', async (req, res) => {
	const id = req.params.id;
	await User.deleteuSers(id);
	flash.success(req, 'Successfully deleted helper account');
	res.redirect('/admin/helpers');
});

module.exports = router;