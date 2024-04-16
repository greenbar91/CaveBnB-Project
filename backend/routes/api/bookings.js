const express = require("express");
const { Spot, SpotImage, Booking } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { formatAllDates, formatLatLng } = require("../../utils/helper");
const {
  validationCheckDateErrors,
  validateEditBooking,
} = require("../../utils/validation");
const router = express.Router();

//!Replace all 403/404 error checks in associated endpoints with new validations in utils/validation
//--------------------------------------------------------------------------------------//
//                        Get all of the Current User's Bookings                        //
//--------------------------------------------------------------------------------------//
router.get("/current", requireAuth, async (req, res) => {
  const currentUserBookings = await Booking.findAll({
    where: {
      userId: req.user.id,
    },
    include: [
      {
        model: Spot,
        attributes: [
          "id",
          "ownerId",
          "address",
          "city",
          "state",
          "country",
          "lat",
          "lng",
          "name",
          "price",
          "previewImage",
        ],
      },
    ],
  });

  /* N+1 query to add previewImage url to Spots */
  for (const booking of currentUserBookings) {
    const imagePreview = await SpotImage.findOne({
      where: {
        spotId: booking.Spot.id,
        preview: true,
      },
    });

    if (imagePreview) {
      booking.Spot.previewImage = imagePreview.url;
    }
  }

  formatAllDates(currentUserBookings);
  formatLatLng(currentUserBookings);

  return res.status(200).json({ Bookings: formattedBookings });
});

//--------------------------------------------------------------------------------------//
//                                    Edit a Booking                                    //
//--------------------------------------------------------------------------------------//
router.put(
  "/:bookingId",
  requireAuth,
  async (req, res, next) => {
    const { bookingId } = req.params;
    const findBookingById = await Booking.findByPk(bookingId);

    if (!findBookingById) {
      return res.status(404).json({
        message: "Booking couldn't be found",
      });
    }

    if (findBookingById.userId !== req.user.id) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    if (findBookingById.endDate < new Date()) {
      return res.status(403).json({
        message: "Past bookings can't be modified",
      });
    }

    next();
  },
  validationCheckDateErrors,
  validateEditBooking,
  async (req, res) => {
    const { bookingId } = req.params;
    const { startDate, endDate } = req.body;

    const findBookingById = await Booking.findByPk(bookingId);

    const editedBooking = await findBookingById.update({
      startDate,
      endDate,
    });

    formatAllDates(editedBooking);
    return res.status(200).json(editedBooking);
  }
);

//--------------------------------------------------------------------------------------//
//                                   Delete a Booking                                   //
//--------------------------------------------------------------------------------------//
router.delete(
  "/:bookingId",
  requireAuth,
  async (req, res, next) => {
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
    next();
  },
  async (req, res) => {
    const { bookingId } = req.params;
    const findBookingById = await Booking.findByPk(bookingId, {
      include: [{ model: Spot }],
    });

    await findBookingById.destroy();

    return res.status(200).json({
      message: "Successfully deleted",
    });
  }
);

module.exports = router;
