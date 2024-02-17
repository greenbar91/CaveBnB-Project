const express = require("express");
const { Spot, SpotImage, User, Review, ReviewImage } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");

const router = express.Router();

router.get('/current', requireAuth, async (req,res) => {

    const allCurrentReviews = await Review.findAll({
        where:{
            ownerId:req.user.id
        },
        include:{
            
        }
    })

    return res.status(200).json()
})


module.exports = router
