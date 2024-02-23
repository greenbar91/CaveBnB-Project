const express = require("express");
const { Spot, User, Review, ReviewImage, Booking } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const {formatAllDates} = require('../../utils/helper')

const router = express.Router();

//Get all of the Current User's Bookings
router.get("/current", requireAuth, async (req, res) => {
  const currentUserBookings = await Booking.findAll({
    where: {
      userId: req.user.id,
    },
    include: [{ model: Spot }],
  });

  formatAllDates(currentUserBookings)


  return res.status(200).json({ Bookings: currentUserBookings });
});

module.exports = router;
