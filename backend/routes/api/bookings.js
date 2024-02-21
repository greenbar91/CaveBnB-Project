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
    booking.createdAt = booking.createdAt
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    booking.updatedAt = booking.updatedAt
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    booking.startDate = booking.startDate.toISOString().slice(0, 9);
    booking.endDate = booking.endDate.toISOString().slice(0, 9);
  });


  return res.status(200).json({ Bookings: currentUserBookings });
});

module.exports = router;
