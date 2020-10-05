// All admin's webpages are contained here

const express = require('express');
const router = express.Router();

// Sample user object to test navigation
// For the planner pages, this user is a admin
const user = { name: "Vignesh", isPlanner: false, isHelper: false, isAdmin: true };

// When creating new routes avoid using the route's name in the webpage's name
// Eg: Use router.get('/planners', ...) instead of router.get('/admin-planners', ...) cause then the url will be '/admin/admin-planners' which is super redundant
// Always keep route urls are short as possible

router.get('/', (req, res) => {
	// Put your ejs files under your specific folder
    // Eg: Admin .ejs files should be put under the admin folder
	res.render('admin/admin-dashboard', { title: "Dashboard", user }); // We pass the user object contructed above to the ejs so it can show the appropriate navbar details and other stuff
});

router.get('/planners', (req, res) => {
	res.render('admin/admin-all-planners', { title: "Planners", user })
});

router.get('/helpers', (req, res) => {
	res.render('admin/admin-all-helpers', { title: "Helpers", user  })
});

module.exports = router;