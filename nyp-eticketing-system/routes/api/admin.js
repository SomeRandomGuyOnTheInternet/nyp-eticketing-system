// All APIs are contained here

const express = require('express');
const router = express.Router();

const respond = require('../../utils/respond');
const auth = require('../../utils/api-auth');

const Venue = require('../../models/Venue');
const User = require('../../models/User');

router.get('/helpers', auth.isAdmin, async (req, res) => {
    try {
        const helpers = await User.getHelpers();
        
        return respond.success(res, "All helpers have been retrieved successfully!", helpers);
    } catch (error) {
        console.error(error);
        return respond.error(res, "Something went wrong while getting all the helpers. Please try again later!", 500);
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