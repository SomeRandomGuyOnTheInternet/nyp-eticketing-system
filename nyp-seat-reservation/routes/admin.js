const express = require('express');
const fs = require('fs');

const router = express.Router();
const User = require('../models/Users.js');

router.get('/admin', (req, res) => {
	res.render('pages/admin/admin', { title: "Admin" })
});

router.get('/admin-planner', (req, res) => {
	res.render('pages/admin/admin-planner', { title: "List of Planner Accounts" })
});

router.get('/admin-helper', (req, res) => {
	res.render('pages/admin/admin-helper', { title: "List of Helper Accounts" })
});

module.exports = router;