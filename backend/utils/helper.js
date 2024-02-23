//backend/utils/helper.js
const formatStartDatesEndDates = async (bookings) => {

   const formattedBookings = await bookings.forEach((booking) => {
        booking.dataValues.startDate = booking.dataValues.startDate.toISOString().slice(0, 10);
        booking.dataValues.endDate = booking.dataValues.endDate.toISOString().slice(0, 10);
      });

    return formattedBookings
}

const formatAllDates = async (bookings) => {
  const formattedBookings = await bookings.forEach((booking) => {
    booking.dataValues.createdAt = booking.dataValues.createdAt
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    booking.dataValues.updatedAt = booking.dataValues.updatedAt
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    booking.dataValues.startDate = booking.dataValues.startDate.toISOString().slice(0, 10);
    booking.dataValues.endDate = booking.dataValues.endDate.toISOString().slice(0, 10);
  });

  return formattedBookings
}


module.exports = {formatStartDatesEndDates, formatAllDates}
