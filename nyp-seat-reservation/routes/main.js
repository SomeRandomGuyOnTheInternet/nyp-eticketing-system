// All non-specific webpages (like login) are contained here

const express = require('express');
const fs = require('fs')
const router = express.Router();

// We are gonna be passing some of the ejs templates we created into the client directly so we can use ejs's client side templating capabilites to create dynamic, reproducible html on the fly
// For this, we have to import all the desired templates as plain text and put them in an object that we pass to the client side's script so the client side ejs can use the templates accordingly
const toastTemplate = JSON.stringify(fs.readFileSync("./views/templates/toast.ejs", "utf8"));
const ejsTemplates = { toast: toastTemplate };

// Sample user object to test navigation
// For the test pages, this user is neither a planner or helper or an admin
const user = { name: "Vignesh", isPlanner: false, isHelper: false, isAdmin: false };

router.get('/', async (req, res) => {
	res.render('test/main', { 
		title: "Tessssst", 
		user,
		ejsTemplates, 
	})
});

module.exports = router;