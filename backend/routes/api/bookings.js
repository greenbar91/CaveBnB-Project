const express = require("express");
const { Spot, User, Review, ReviewImage, Booking } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");

const router = express.Router();

//Get all of the Current User's Bookings
router.get("/current", requireAuth, async (req, res) => {
  let currentUserBookings = await Booking.findAll({
    where: {
      userId: req.user.id,
    },
    include: [{ model: Spot }],
  });

  currentUserBookings.forEach((booking) => {
    booking.dataValues.createdAt = booking.dataValues.createdAt
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    booking.dataValues.updatedAt = booking.dataValues.updatedAt
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    booking.dataValues.startDate = booking.dataValues.startDate.toISOString().slice(0, 10);
    booking.dataValues.endDate = booking.dataValues.endDate.toISOString().slice(0, 10);
  });


  return res.status(200).json({ Bookings: currentUserBookings });
});

module.exports = router;
