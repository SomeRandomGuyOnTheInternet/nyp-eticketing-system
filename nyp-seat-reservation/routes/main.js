const express = require('express');
const router = express.Router();

// Sample user object to test navigation
const user = { name: "Vignesh", isPlanner: false, isHelper: false, isAdmin: true };

router.get('/', (req, res) => {
	res.render('test/main', { title: "Tessssst", user })
});

module.exports = router;