// All non-specific webpages (like login) are contained here

const express = require('express');
const router = express.Router();

// Sample user object to test navigation
// For the test pages, this user is neither a planner or helper or an admin
const user = { name: "Vignesh", isPlanner: false, isHelper: false, isAdmin: false };

router.get('/', async (req, res) => {
	res.render('test/main', { 
		title: "Tessssst", 
		user
	})
});

module.exports = router;