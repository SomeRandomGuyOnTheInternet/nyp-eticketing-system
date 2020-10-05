const express = require('express');
const fs = require('fs');

const router = express.Router();

const User = require('../models/Users.js');


router.get('/', (req, res) => {
	res.render('pages/test', { title: "Tessssst" })
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