// All non-specific webpages (like login) are contained here

const express = require('express');
const passport = require('passport');
const router = express.Router();

const flashError = require('../utils/flashError');
const flashSuccess = require('../utils/flashSuccess');

// // Sample user object to test navigation
// // For the test pages, this user is neither a planner or helper or an admin
// const user = { name: "", isPlanner: false, isHelper: false, isAdmin: false };

router.get('/', async (req, res) => {
	res.render('test/main', { 
		title: "Tessssst"
	})
});

router.get('/login', checkNotAuthenticated, async (req, res) => {
	res.render('auth/login', { 
		title: "Login", 
	})
});

router.post('/login', (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: './admin/admin-dashboard',
		failureRedirect: '/login',
		failureFlash: true
	})(req, res, next);
});

router.delete('/logout', (req, res) => {
	req.logOut()
	res.redirect('./login')
});

function checkAuthenticated(req, res, next) {
	if (req.isAuthenticated()){
		return next()
	}

	res.redirect('/login')
};

function checkNotAuthenticated(req, res, next) {
	if (req.isAuthenticated()){
		return res.redirect('/')
	}
	next()
}

module.exports = router;