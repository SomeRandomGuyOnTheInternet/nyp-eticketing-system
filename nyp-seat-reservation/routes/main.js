const express = require('express');
const fs = require('fs');

const router = express.Router();

const User = require('../models/Users.js');


router.get('/', (req, res) => {
	User.create({
		email: "user.id",
		password: "selectedFoodId",
		name: "Ejaegoae",
		role: "getMealType()",
		isDeleted: false,
	});
	res.render('pages/test', { title: "Redirecting..." })
});


module.exports = router;