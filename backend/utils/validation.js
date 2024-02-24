// backend/utils/validation.js
const { validationResult } = require("express-validator");
const { check } = require("express-validator");
const { Booking } = require("../db/models");
const { Op } = require("sequelize");
// middleware for formatting errors from express-validator middleware

const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = {};
    validationErrors
      .array()
      .forEach((error) => (errors[error.path] = error.msg));
    let status = 400;

    let err = Error("Bad request");

    if (
      errors.startDate === "Start date conflicts with an existing booking" ||
      errors.endDate === "End date conflicts with an existing booking"
    ) {
      err = Error("Sorry, this spot is already booked for the specified dates");
      status = 403;
    }

    if (
      errors.startDate === "startDate cannot be in the past" ||
      errors.endDate === "endDate cannot be on or before startDate"
    ) {
      status = 400
    }
    err.errors = errors;
    err.status = status;
    err.title = "Bad request";
    next(err);
  }
  next();
};
const validationCheckDateErrors = [
  check("startDate").isAfter().withMessage("startDate cannot be in the past"),
  check("endDate").custom((dateValue, { req }) => {
    if (dateValue <= req.body.startDate) {
      throw new Error("endDate cannot be on or before startDate");
    }
    return true;
  }),
];
const validationCheckBookingConflict = [
  check("startDate").custom(async (startDate, { req }) => {
    const endDate = req.body.endDate;
    const conflictBookings = await Booking.findOne({
      where: {
        spotId: req.params.spotId,

        [Op.or]: [
          { endDate: { [Op.between]: [startDate, endDate] } },
          {
            [Op.and]: [
              { startDate: { [Op.lte]: startDate } },
              { endDate: { [Op.gte]: startDate } },
            ],
          },
        ],
      },
    });
    if (conflictBookings) {
      throw new Error("Start date conflicts with an existing booking");
    }
    return true;
  }),
  check("endDate").custom(async (endDate, { req }) => {
    const startDate = req.body.startDate;
    const conflictBooking = await Booking.findOne({
      where: {
        spotId: req.params.spotId,

        [Op.or]: [
          { startDate: { [Op.between]: [startDate, endDate] } },
          {
            [Op.and]: [
              { startDate: { [Op.lte]: endDate } },
              { endDate: { [Op.gte]: endDate } },
            ],
          },
        ],
      },
    });
    if (conflictBooking) {
      throw new Error("End date conflicts with an existing booking");
    }
    return true;
  }),
  handleValidationErrors,
];

module.exports = {
  handleValidationErrors,
  validationCheckDateErrors,
  validationCheckBookingConflict,
};
