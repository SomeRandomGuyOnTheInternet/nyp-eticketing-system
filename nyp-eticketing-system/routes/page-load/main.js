// All non-specific webpages (like login) are contained here

const express = require('express');
const passport = require('passport');
const router = express.Router();

const flash = require('../../utils/flash');
const auth = require('../../utils/page-load-auth');

// // Sample user object to test navigation
// // For the test pages, this user is neither a planner or helper or an admin
// const user = { name: "", isPlanner: false, isHelper: false, isAdmin: false };

router.get('/', async (req, res) => {
	if (req.user) {
		if (req.user.isAdmin) {
			res.redirect('/admin/planners');
		} else if (req.user.isPlanner) {
			res.redirect('/planner/events');
		} else if (req.user.isHelper) {
			res.redirect('/helper');
		} else {
			res.redirect('/logout');
		}
	} else {
		res.redirect('/logout');
	}
});

router.get('/login', auth.isSignedOut, async (req, res) => {
	res.render('auth/login', { 
		title: "Login", 
	})
});

router.post('/login', auth.isSignedOut, (req, res, next) => {
	passport.authenticate('local', {
		successRedirect:'/',
		failureRedirect: '/login',
		failureFlash: true
	})(req, res, next);
});

router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/login');
});

router.get('/test', async (req, res) => {
	res.render('test/main', { 
		title: "Test", 
	})
});

module.exports = router;