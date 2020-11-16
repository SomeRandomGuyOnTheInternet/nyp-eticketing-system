// All APIs are contained here

const express = require('express');
const router = express.Router();

const respond = require('../../utils/respond');
const auth = require('../../utils/api-auth');

const Venue = require('../../models/Venue');
const User = require('../../models/User');

router.get('/planners', auth.isAdmin, async (req, res) => {
    try {
        const planners = await User.getPlanners();
        
        return respond.success(res, "All planners have been retrieved successfully!", planners);
    } catch (error) {
        console.error(error);
        return respond.error(res, "Something went wrong while getting all the planners. Please try again later!", 500);
    }
});

router.post('/planners', auth.isAdmin, async (req, res) => {
	let name = req.body.name;
	let email = req.body.email;
    let password = req.body.password;

	if (!name) return respond.error(res, "Please enter a name!", 400);
	if (!email) return respond.error(res, "Please enter an email!", 400);
    if (!email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) return respond.error(res, "Please enter a valid email!", 400);
	if (!password) return respond.error(res, "Please enter a password!", 400);

    try {
        let existingEmail = await User.getUserByEmail(email.toLocaleLowerCase());
        if (existingEmail) return respond.error(res, "This email has already been registered!", 400);

        await User.createUser({
            email: email,
            password: password,
            name: name,
            isAdmin: false,
            isPlanner: true,
            isHelper: false,
            isDeleted: false
        });
        
        return respond.success(res, "Plannner account has been created successfully!");     
    } catch (error) {
        console.error(error);
        return respond.error(res, "Something went wrong while creating the planner account. Please try again later!", 500);
    }
});

router.delete('/planners/:id', auth.isAdmin, async (req, res) => {
    const id = req.params.id;

    try {
        const user = await User.findByPk(id);
        if (!user) return respond.error(res, "That planner does not exist!", 404);
        if (user.isPlanner === false) return respond.error(res, "That id does not belong to a valid planner!", 404);
    
        await User.destroy({ where: { id: user.id } });
    
        return respond.success(res, "Planner account has been deleted successfully!");
    } catch (error) {
        console.error(error);
        return respond.error(res, "Something went wrong while getting the planner's details. Please try again later!", 500);
    }
});

router.get('/helpers', auth.isAdmin, async (req, res) => {
    try {
        const helpers = await User.getHelpers();
        
        return respond.success(res, "All helpers have been retrieved successfully!", helpers);
    } catch (error) {
        console.error(error);
        return respond.error(res, "Something went wrong while getting all the helpers. Please try again later!", 500);
    }
});

router.post('/helpers', auth.isAdmin, async (req, res) => {
	let name = req.body.name;
	let email = req.body.email;
	let password = req.body.password;
	let phoneNumber = req.body.phoneNumber;

	if (!name) return respond.error(res, "Please enter a name!", 400);
	if (!email) return respond.error(res, "Please enter an email!", 400);
    if (!email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) return respond.error(res, "Please enter a valid email!", 400);
    if (!phoneNumber) return respond.error(res, "Please enter a phone number!", 400);
	if (!(/^(8|9)[0-9]{7}$/.test(phoneNumber))) return respond.error(res, "Please enter a valid phone number!", 400);
	if (!password) return respond.error(res, "Please enter a password!", 400);

    try {
        let existingEmail = await User.getUserByEmail(email.toLocaleLowerCase());
        if (existingEmail) return respond.error(res, "This email has already been registered!", 400);
        
        await User.createUser({
            email: email,
            password: password,
            phoneNumber: phoneNumber,
            name: name,
            isAdmin: false,
            isPlanner: false,
            isHelper: true,
            isDeleted: false
        });
        
        return respond.success(res, "Helper account has been created successfully!");     
    } catch (error) {
        console.error(error);
        return respond.error(res, "Something went wrong while creating the helper account. Please try again later!", 500);
    }
});

router.delete('/helpers/:id', auth.isAdmin, async (req, res) => {
    const id = req.params.id;

    try {
        const user = await User.findByPk(id);
        if (!user) return respond.error(res, "That helper does not exist!", 404);
        if (user.isHelper === false) return respond.error(res, "That id does not belong to a valid helper!", 404);
    
        await User.destroy({ where: { id: user.id } });
    
        return respond.success(res, "Helper account has been deleted successfully!");
    } catch (error) {
        console.error(error);
        return respond.error(res, "Something went wrong while getting the helper's details. Please try again later!", 500);
    }
});

router.get('/venues', auth.isAdmin, async (req, res) => {
    try {
        const venues = await Venue.findAll({
            order: [['name', 'ASC']]
        });

        return respond.success(res, "All venues have been retrieved successfully!", venues);
    } catch (error) {
        console.error(error);
        return respond.error(res, "Something went wrong while getting all venues!", 500);
    }
});

router.get('/venues/:id', auth.isAdmin, async (req, res) => {
    const id = req.params.id;

    try {
        const venue = await Venue.findByPk(id);

        if (!venue) return respond.error(res, "That venue does not exist!", 404);

        return respond.success(res, "Venue details have been retrieved successfully!", venue);
    } catch (error) {
        console.error(error);
        return respond.error(res, "Something went wrong while getting all venues!", 500);
    }
});

router.post('/venues', auth.isAdmin, async (req, res) => {
    const name = req.body.name;
    const seatMap = req.body.seatMap;

    if (!name) return respond.error(res, "Please provide a venue name!", 400);
    if (!seatMap) return respond.error(res, "Please provide a seat map for the venue!", 400);

    try {
        const existingVenue = await Venue.findOne({
            where: { name: name }
        });

        if (existingVenue) return respond.error(res, "Please provide a unqiue name for the venue!", 400);

        await Venue.create({
            name: name,
            seatMap: JSON.stringify(seatMap)
        });

        return respond.success(res, "A new venue has been created successfully!");
    } catch (error) {
        console.error(error);
        return respond.error(res, "Something went wrong while creating this venue!", 500);
    }
});

router.put('/venues/:id', auth.isAdmin, async (req, res) => {
    const id = req.params.id;
    const name = req.body.name;
    const seatMap = req.body.seatMap;

    if (!name) return respond.error(res, "Please provide a venue name!");
    if (!seatMap) return respond.error(res, "Please provide a seat map for the venue!");

    try {
        await Venue.update({
            id: id,
            name: name,
            seatMap: JSON.stringify(seatMap)
        },{ 
            where: { id: id } 
        });

        return respond.success(res, "The venue has been updated successfully!");
    } catch (error) {
        console.error(error);
        return respond.error(res, "Something went wrong while updating this venue!", 500);
    }
});

router.delete('/venues/:id', auth.isAdmin, async (req, res) => {
    const id = req.params.id;
    
    try {
        await Venue.destroy({ where: { id: id } });

        return respond.success(res, "The venue has been deleted successfully!");
    } catch (error) {
        console.error(error);
        return respond.error(res, "Something went wrong while deleting this venue!", 500);
    }
});

module.exports = router;