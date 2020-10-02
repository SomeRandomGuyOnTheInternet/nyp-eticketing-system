const express = require('express');
const fs = require('fs');

const router = express.Router();

const User = require('../models/Users.js');


router.get('/', (req, res) => {
	res.render('pages/test', { title: "Tessssst" })
});


module.exports = router;