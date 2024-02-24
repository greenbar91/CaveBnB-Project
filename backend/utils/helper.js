//backend/utils/helper.js

const formatAllDates = async (bookings) => {
  if (Array.isArray(bookings)) {
    const formattedBookings = bookings.forEach((booking) => {
      if (booking.dataValues.createdAt) {
        booking.dataValues.createdAt = booking.dataValues.createdAt
          .toISOString()
          .slice(0, 19)
          .replace("T", " ");
      }
      if (booking.dataValues.updatedAt) {
        booking.dataValues.updatedAt = booking.dataValues.updatedAt
          .toISOString()
          .slice(0, 19)
          .replace("T", " ");
      }
      if (booking.dataValues.startDate) {
        booking.dataValues.startDate = booking.dataValues.startDate
          .toISOString()
          .slice(0, 10);
        booking.dataValues.endDate = booking.dataValues.endDate
          .toISOString()
          .slice(0, 10);
      }
    });
    return formattedBookings;
  } else {
    if (bookings.dataValues.createdAt) {
      bookings.dataValues.createdAt = bookings.dataValues.createdAt
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
    }
    if (bookings.dataValues.updatedAt) {
      bookings.dataValues.updatedAt = bookings.dataValues.updatedAt
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
    }
    if (bookings.dataValues.startDate) {
      bookings.dataValues.startDate = bookings.dataValues.startDate
        .toISOString()
        .slice(0, 10);
      bookings.dataValues.endDate = bookings.dataValues.endDate
        .toISOString()
        .slice(0, 10);
    }
  }
};

module.exports = {  formatAllDates };
