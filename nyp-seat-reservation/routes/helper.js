// All helper's webpages are contained here

const express = require('express');
const router = express.Router();

const flash = require('../utils/flash');
const auth = require('../utils/check-auth');

// When creating new routes avoid using the route's name in the webpage's name
// Eg: Use router.get('/venues', ...) instead of router.get('/helper-venues', ...) cause then the url will be '/helper/helper-venues' which is super redundant
// Always keep route urls are short as possible

router.get('/', auth.isHelper, (req, res) => {
    // Put your ejs files under your specific folder
    // Eg: Admin .ejs files should be put under the admin folder
	res.render('helper/helper-all-events', { 
		title: "Events", 
		user: req.user
	});
});

router.get('/event', auth.isHelper, (req, res) => {
	res.render('helper/helper-view-event', { 
		title: "Event", 
		user: req.user
	});
});

router.get('/eventtopright', auth.isHelper, (req, res) => {
	res.render('helper/helper-view-event-quadrant', { 
		title: "Event", 
		user: req.user
	});;
});

module.exports = router;