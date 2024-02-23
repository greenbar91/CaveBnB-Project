//backend/utils/helper.js
const formatStartDatesEndDates = async (bookings) => {
  if (Array.isArray(bookings)) {
    const formattedBookings = bookings.forEach((booking) => {
      booking.dataValues.startDate = booking.dataValues.startDate
        .toISOString()
        .slice(0, 10);
      booking.dataValues.endDate = booking.dataValues.endDate
        .toISOString()
        .slice(0, 10);
    });

    return formattedBookings;
  } else {
    bookings.dataValues.startDate = bookings.dataValues.startDate
      .toISOString()
      .slice(0, 10);
    bookings.dataValues.endDate = bookings.dataValues.endDate
      .toISOString()
      .slice(0, 10);
  }
};

const formatAllDates = async (bookings) => {
  if (Array.isArray(bookings)) {
    const formattedBookings = bookings.forEach((booking) => {
      booking.dataValues.createdAt = booking.dataValues.createdAt
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      booking.dataValues.updatedAt = booking.dataValues.updatedAt
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      booking.dataValues.startDate = booking.dataValues.startDate
        .toISOString()
        .slice(0, 10);
      booking.dataValues.endDate = booking.dataValues.endDate
        .toISOString()
        .slice(0, 10);
    });

    return formattedBookings;
  } else {
    bookings.dataValues.createdAt = bookings.dataValues.createdAt
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    bookings.dataValues.updatedAt = bookings.dataValues.updatedAt
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    bookings.dataValues.startDate = bookings.dataValues.startDate
      .toISOString()
      .slice(0, 10);
    bookings.dataValues.endDate = bookings.dataValues.endDate
      .toISOString()
      .slice(0, 10);
  }
};

module.exports = { formatStartDatesEndDates, formatAllDates };
