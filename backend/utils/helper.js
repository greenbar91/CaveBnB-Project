//backend/utils/helper.js

const formatAllDates = (bookings) => {
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

const formatLatLng = (spotData) => {
  if (Array.isArray(spotData)) {
    const formattedLatLngArray = spotData.forEach((data) => {
      if (data.dataValues.lat) {
        data.dataValues.lat = parseFloat(data.dataValues.lat);
      }
      if (data.dataValues.lng) {
        data.dataValues.lng = parseFloat(data.dataValues.lng);
      }
      // if (spotData.Spot.dataValues.lat && spotData.Spot.dataValues.lng) {
      //   spotData.Spot.dataValues.lat = parseFloat(spotData.Spot.dataValues.lat);
      //   spotData.Spot.dataValues.lng = parseFloat(spotData.Spot.dataValues.lng);
      // }
    });
    return formattedLatLngArray;
  } else {
    if (spotData.dataValues.lat) {
      spotData.dataValues.lat = parseFloat(spotData.dataValues.lat);
    }
    if (spotData.dataValues.lng) {
      spotData.dataValues.lng = parseFloat(spotData.dataValues.lng);
    }
    return spotData;
  }
};

module.exports = { formatAllDates, formatLatLng };
