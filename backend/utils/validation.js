// backend/utils/validation.js
const { validationResult } = require("express-validator");

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
    err.errors = errors;
    err.status = status;
    err.title = "Bad request";
    next(err);
  }
  next();
};

module.exports = {
  handleValidationErrors,
};
