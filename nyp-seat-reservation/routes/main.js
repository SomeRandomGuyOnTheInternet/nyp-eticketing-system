const express = require('express');
const router = express.Router();

// Sample user object to test navigation
const user = { name: "Vignesh", isPlanner: false, isHelper: false, isAdmin: true };

router.get('/', (req, res) => {
	res.render('test/main', { title: "Tessssst", user })
});

router.get('/helper', (req, res) => {
	res.render('pages/helper', { title: "Helper" })
});

router.get('/admin', (req, res) => {
	res.render('pages/admin', { title: "Admin" })
});

router.get('/helperseat', (req, res) => {
	res.render('pages/helperseat', { title: "HelperSeat" })
});


module.exports = router;