const express = require("express");
const { Spot, Booking } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { formatAllDates } = require("../../utils/helper");
const {
  validationCheckDateErrors,
  validateEditBooking,
} = require("../../utils/validation");

const router = express.Router();

//Get all of the Current User's Bookings
router.get("/current", requireAuth, async (req, res) => {
  const currentUserBookings = await Booking.findAll({
    where: {
      userId: req.user.id,
    },
    include: [{ model: Spot , attributes:['id','ownerId','address','city','state','country',
    'lat','lng','name','price', "previewImage"]}],
  });

  formatAllDates(currentUserBookings);

  return res.status(200).json({ Bookings: currentUserBookings });
});

//Edit a Booking
//!ERROR - Edit a Booking - Start Date On Existing End Date, still lets you
router.put(
  "/:bookingId",
  requireAuth,
  validationCheckDateErrors,
  validateEditBooking,
  async (req, res) => {
    const { bookingId } = req.params;
    const { startDate, endDate } = req.body;

    const findBookingById = await Booking.findByPk(bookingId);

    if (findBookingById.endDate < new Date()) {
      return res.status(403).json({
        message: "Past bookings can't be modified",
      });
    }

    if (!findBookingById) {
      return res.status(404).json({
        message: "Booking couldn't be found",
      });
    }

    if (findBookingById.ownerId !== req.user.id) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const editedBooking = await findBookingById.update({
      startDate,
      endDate,
    });

    formatAllDates(editedBooking);

    return res.status(200).json(editedBooking);
  }
);

//Delete a Booking
router.delete("/:bookingId", requireAuth, async (req, res) => {
  const { bookingId } = req.params;

  const findBookingById = await Booking.findByPk(bookingId, {
    include: [{ model: Spot }],
  });

  if (!findBookingById) {
    return res.status(404).json({
      message: "Booking couldn't be found",
    });
  }

  if (findBookingById.userId !== req.user.id) {
    if (findBookingById.Spot.ownerId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
  }

  if (findBookingById.startDate < new Date()) {
    return res.status(403).json({
      message: "Bookings that have been started can't be deleted",
    });
  }

  await findBookingById.destroy();

  return res.status(200).json({
    message: "Successfully deleted",
  });
});

module.exports = router;
