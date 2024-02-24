// backend/utils/validation.js
const { validationResult } = require("express-validator");
const { check } = require("express-validator");
const { Booking, User } = require("../db/models");
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

    if(errors.email === 'User with that email already exists'){
      err = Error("User already exists")
      status = 500
    }

    err.errors = errors;
    err.status = status;
    err.title = "Bad request";
    next(err);
  }
  next();
};

const validateSignup = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Please provide a valid email."),
  check("username")
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("Please provide a username with at least 4 characters."),
  check("username").not().isEmail().withMessage("Username cannot be an email."),
  check("password")
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters or more."),
  handleValidationErrors,
];

const validateUserExists = [
  check("email")
  .custom(async (email, {req}) => {
    const userAlreadyExists = await User.findOne({
      where:{email}
    })
    if(userAlreadyExists){
      throw new Error("User with that email already exists")
    }
  })
]

const validationCheckDateErrors = [
  check("startDate").isAfter().withMessage("startDate cannot be in the past"),
  check("endDate").custom((dateValue, { req }) => {
    if (dateValue <= req.body.startDate) {
      throw new Error("endDate cannot be on or before startDate");
    }
    return true;
  }),
  handleValidationErrors,
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
  }),
  handleValidationErrors,
];

module.exports = {
  handleValidationErrors,
  validationCheckDateErrors,
  validationCheckBookingConflict,
  validateSignup,
  validateUserExists
};
