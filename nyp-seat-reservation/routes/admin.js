// All admin's webpages are contained here

const express = require('express');
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

router.get('/planners', auth.isAdmin, (req, res) => {
	res.render('admin/admin-all-planners', { 
		title: "Planners", 
		user: req.user
	});
});

router.get('/helpers', auth.isAdmin, (req, res) => {
	res.render('admin/admin-all-helpers', { 
		title: "Helpers", 
		user: req.user
	});
});

module.exports = router;