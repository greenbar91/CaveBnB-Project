const express = require("express");
const {Spot} = require('../../db/models')


const router = express.Router();

//Get all the spots
router.get('/', async (req,res) => {

    const allSpots = await Spot.findAll()
    console.log(allSpots)
    return res.status(200).json(allSpots)
})

//Get all Spots owned by the Current User
router.get('/current', async (req,res) => {
    const currentUserSpots = await Spot.findAll({
        where:{
            ownerId: req.user.id
        }
    })

    return res.status(200).json(currentUserSpots)
})


module.exports = router;
