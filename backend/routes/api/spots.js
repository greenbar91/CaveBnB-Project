const express = require("express");
const {Spot} = require('../../db/models')


const router = express.Router();

//Get all the spots
router.get('/', async (req,res) => {

    const allSpots = await Spot.findAll()
    console.log(allSpots)
    return res.status(200).json(allSpots)
})


module.exports = router;
