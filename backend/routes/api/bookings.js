const express = require("express");
const { Spot, User, Review, ReviewImage, Booking } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { formatAllDates } = require("../../utils/helper");
const {
  validationCheckDateErrors,
  validationCheckBookingConflict,
} = require("../../utils/validation");

const router = express.Router();

//Get all of the Current User's Bookings
router.get("/current", requireAuth, async (req, res) => {
  const currentUserBookings = await Booking.findAll({
    where: {
      userId: req.user.id,
    },
    include: [{ model: Spot }],
  });

  formatAllDates(currentUserBookings);

  return res.status(200).json({ Bookings: currentUserBookings });
});

//Edit a Booking
router.put(
  "/:bookingId",
  requireAuth,
  validationCheckDateErrors,
  validationCheckBookingConflict,
  async (req, res) => {
    const {bookingId} = req.params
    const {startDate,endDate} = req.body
    const currentDate = new Date()
    const findBookingById = await Booking.findByPk(bookingId)



    if(!findBookingById){
      return res.status(404).json({
        message:"Booking couldn't be found"

      })
    }

    if(findBookingById.endDate < currentDate){
      return res.status(403).json({
        message:"Past bookings can't be modified"

      })
    }

    formatAllDates(findBookingById)



    const editedBooking = await findBookingById.update({
      startDate,
      endDate
    })

    return res.status(200).json(editedBooking)
  }

);

module.exports = router;
