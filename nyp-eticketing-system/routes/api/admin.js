// All APIs are contained here

const express = require('express');
const router = express.Router();

const status = require('../../utils/status');
const auth = require('../../utils/api-auth');

const Venue = require('../../models/Venue');
const User = require('../../models/User');


router.get('/helpers', async (req, res) => {
    try {
        const helpers = await User.getHelpers();
        
        return status.success(res, "Successfully gotten all helpers!", helpers);
    } catch (error) {
        console.error(error);
        return ajax.error(res, "Something went wrong while getting all the helpers. Please try again later!", 500);
    }
});

router.get('/venues', async (req, res) => {
    try {
        const venues = await Venue.findAll({
            order: [['name', 'ASC']]
        });

        return status.success(res, "Successfully gotten all venues!", venues);
    } catch (error) {
        console.error(error);
        return ajax.error(res, "Something went wrong while getting all venues!", 500);
    }
});

router.get('/venues/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const venue = await Venue.findByPk(id);

        if (!venue) return ajax.error(res, "That venue does not exist!", 404);

        return status.success(res, "Successfully gotten all venues!", venue);
    } catch (error) {
        console.error(error);
        return ajax.error(res, "Something went wrong while getting all venues!", 500);
    }
});

router.post('/venues', auth.isAdmin, async (req, res) => {
    const name = req.body.name;
    const seatMap = req.body.seatMap;

    if (!name) return ajax.error(res, "Please provide a venue name!", 400);
    if (!seatMap) return ajax.error(res, "Please provide a seat map for the venue!", 400);

    try {
        await Venue.create({
            name: name,
            seatMap: JSON.stringify(seatMap)
        });

        return status.success(res, "Successfully added venue!");
    } catch (error) {
        console.error(error);
        return ajax.error(res, "Something went wrong while creating this venue!", 500);
    }
});

router.put('/venues/:id', auth.isAdmin, async (req, res) => {
    const id = req.params.id;
    const name = req.body.name;
    const seatMap = req.body.seatMap;

    if (!name) return ajax.error(res, "Please provide a venue name!");
    if (!seatMap) return ajax.error(res, "Please provide a seat map for the venue!");

    try {
        await Venue.update({
            id: id,
            name: name,
            seatMap: JSON.stringify(seatMap)
        },{ 
            where: { id: id } 
        });

        return status.success(res, "Successfully updated venue!");
    } catch (error) {
        console.error(error);
        return ajax.error(res, "Something went wrong while updating this venue!", 500);
    }
});

router.delete('/venues/:id', auth.isAdmin, async (req, res) => {
    const id = req.params.id;
    
    try {
        await Venue.destroy({ where: { id: id } });

        return status.success(res, "Successfully deleted venue!");
    } catch (error) {
        console.error(error);
        return ajax.error(res, "Something went wrong while deleting this venue!", 500);
    }
});


module.exports = router;