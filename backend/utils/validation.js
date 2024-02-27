// backend/utils/validation.js
const { validationResult } = require("express-validator");
const { check } = require("express-validator");
const { Booking, User } = require("../db/models");
const { Op } = require("sequelize");

// middleware for formatting errors from express-validator middleware

const validateLogin = [
  check("credential")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Email or username is required"),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Password is required"),
  (req, _res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      const errors = {};
      validationErrors
        .array()
        .forEach((error) => (errors[error.path] = error.msg));
      let err = Error("Bad request");
      err.errors = errors;
      err.status = 400;
      next(err);
    }
    next();
  },
];

const validateUserExists = [
  check("email").custom(async (email, { req }) => {
    const userAlreadyExists = await User.findOne({
      where: { email },
    });
    if (userAlreadyExists) {
      throw new Error("User with that email already exists");
    }
  }),
  check("username").custom(async (username, { req }) => {
    const userAlreadyExists = await User.findOne({
      where: { username },
    });
    if (userAlreadyExists) {
      throw new Error("User with that username already exists");
    }
  }),
  (req, _res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      const errors = {};
      validationErrors
        .array()
        .forEach((error) => (errors[error.path] = error.msg));
      let err = Error("User already exists");
      err.errors = errors;
      err.status = 500;
      next(err);
    }
    next();
  },
];

const validateSignup = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Invalid email"),
  check("username")
    .exists({ checkFalsy: true })
    .withMessage("Username is required"),
  check("firstName")
    .exists({ checkFalsy: true })
    .withMessage("First Name is required"),
  check("lastName")
    .exists({ checkFalsy: true })
    .withMessage("Last Name is required"),
  (req, _res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      const errors = {};
      validationErrors
        .array()
        .forEach((error) => (errors[error.path] = error.msg));
      let err = Error("Bad request");
      err.errors = errors;
      err.status = 400;
      next(err);
    }
    next();
  },
];

const validateSpotQueryFilters = [
  check("page")
  .optional({ checkFalsy: true })
  .isInt({min:1})
  .withMessage("Page must be greater than or equal to 1"),
  check("size")
  .optional({ checkFalsy: true })
  .isInt({min:1})
  .withMessage("Size must be greater than or equal to 1"),
  check("maxLat")
  .optional({ checkFalsy: true })
  .isFloat({max:90})
  .withMessage("Maximum latitude is invalid"),
  check("minLat")
  .optional({ checkFalsy: true })
  .isFloat({min:-90})
  .withMessage("Minimum latitude is invalid"),
  check("minLng")
  .optional({ checkFalsy: true })
  .isFloat({min:-180})
  .withMessage("Maximum longitude is invalid"),
  check("maxLng")
  .optional({ checkFalsy: true })
  .isFloat({max:180})
  .withMessage("Minimum longitude is invalid"),
  check("minPrice")
  .optional({ checkFalsy: true })
  .isInt({min:0})
  .withMessage("Minimum price must be greater than or equal to 0"),
  check("maxPrice")
  .optional({ checkFalsy: true })
  .isInt({min:0})
  .withMessage("Maximum price must be greater than or equal to 0"),
  (req, _res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      const errors = {};
      validationErrors
        .array()
        .forEach((error) => (errors[error.path] = error.msg));
      let err = Error("Bad request");
      err.errors = errors;
      err.status = 400;
      next(err);
    }
    next();
  },
]


const validateSpotBody = [
  check("address")
    .exists({ checkFalsy: true })
    .withMessage("Street address is required"),
  check("city").exists({ checkFalsy: true }).withMessage("City is required"),
  check("state").exists({ checkFalsy: true }).withMessage("State is required"),
  check("country")
    .exists({ checkFalsy: true })
    .withMessage("Country is required"),
  check("lat")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be within -90 and 90"),
  check("lng")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be within -180 and 180"),
  check("name")
    .isLength({ max: 49 })
    .withMessage("Name must be less than 50 characters"),
  check("description")
    .exists({ checkFalsy: true })
    .withMessage("Description is required"),
  check("price")
    .isFloat({ min: 1 })
    .withMessage("Price per day must be a positive number"),
  (req, _res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      const errors = {};
      validationErrors
        .array()
        .forEach((error) => (errors[error.path] = error.msg));
      let err = Error("Bad request");
      err.errors = errors;
      err.status = 400;
      next(err);
    }
    next();
  },
];

const validateReviewBody = [
  check("review")
    .exists({ checkFalsy: true })
    .withMessage("Review text is required"),
  check("stars")
    .isInt({ min: 1, max: 5 })
    .withMessage("Stars must be an integer from 1 to 5"),
  (req, _res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      const errors = {};
      validationErrors
        .array()
        .forEach((error) => (errors[error.path] = error.msg));
      let err = Error("Bad request");
      err.errors = errors;
      err.status = 400;
      next(err);
    }
    next();
  },
];


const validationCheckDateErrors = [
  check("startDate").isAfter().withMessage("startDate cannot be in the past"),
  check("endDate").custom((dateValue, { req }) => {
    if (dateValue <= req.body.startDate) {
      throw new Error("endDate cannot be on or before startDate");
    }
    return true;
  }),
  (req, res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      const errors = {};
      validationErrors
        .array()
        .forEach((error) => (errors[error.path] = error.msg));
      let err = Error("Bad request");
      err.errors = errors;
      err.status = 400;
      return res.status(400).json({
        message: "Bad request",
        errors: errors
      });
    }

    next();
  },
];



const validateNewBooking = [
  check("startDate").custom(async (startDate, { req }) => {
    const endDate = req.body.endDate;
    const { spotId } = req.params;
    const conflictBookings = await Booking.findOne({
      where: {
        spotId,

        [Op.or]: [
          { startDate: { [Op.between]: [startDate, endDate] } },
          {
            [Op.and]: [
              { startDate: { [Op.lte]: endDate } },
              { endDate: { [Op.gte]: endDate } },
            ],
          },
          {
            [Op.and]: [
              { startDate: { [Op.lte]: startDate } },
              { endDate: { [Op.gte]: endDate } },
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
    const { spotId } = req.params;
    const conflictBooking = await Booking.findOne({
      where: {
        spotId,

        [Op.or]: [
          { endDate: { [Op.between]: [startDate, endDate] } },
          {
            [Op.and]: [
              { startDate: { [Op.lte]: startDate } },
              { endDate: { [Op.gte]: startDate } },
            ],
          },
          {
            [Op.and]: [
              { startDate: { [Op.lte]: startDate } },
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
  (req, _res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      const errors = {};
      validationErrors
        .array()
        .forEach((error) => (errors[error.path] = error.msg));
      let err = Error(
        "Sorry, this spot is already booked for the specified dates"
      );
      err.errors = errors;
      err.status = 403;
      next(err);
    }
    next();
  },
];

const validateEditBooking = [
  check("startDate").custom(async (startDate, { req }) => {
    const endDate = req.body.endDate;
    const { bookingId } = req.params;
    const findBookingById = await Booking.findByPk(bookingId);
    if(!findBookingById){
      return true
    }
    const conflictBookings = await Booking.findOne({
      where: {
        spotId: findBookingById.spotId,
        id: { [Op.ne]: bookingId },


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
    const { bookingId } = req.params;
    const findBookingById = await Booking.findByPk(bookingId);
    if(!findBookingById){
      return true
    }

    const conflictBooking = await Booking.findOne({
      where: {
        spotId: findBookingById.spotId,

        id: { [Op.ne]: bookingId },

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
  (req, _res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      const errors = {};
      validationErrors
        .array()
        .forEach((error) => (errors[error.path] = error.msg));
      let err = Error(
        "Sorry, this spot is already booked for the specified dates"
      );
      err.errors = errors;
      err.status = 403;
      next(err);
    }
    next();
  },
];

module.exports = {
  validationCheckDateErrors,
  validateNewBooking,
  validateSignup,
  validateUserExists,
  validateLogin,
  validateSpotBody,
  validateReviewBody,
  validateEditBooking,
  validateSpotQueryFilters
};
