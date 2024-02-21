"use strict";

const { Booking } = require("../models");
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Booking.bulkCreate(
      [
        {
          id: 1,
          spotId: 1,
          Spot: {
            id: 1,
            ownerId: 1,
            address: "123 Disney Lane",
            city: "San Francisco",
            state: "California",
            country: "United States of America",
            lat: 37.7645358,
            lng: -122.4730327,
            name: "App Academy",
            price: 123,
            previewImage: "image url",
          },
          userId: 2,
          startDate: "2024-02-21",
          endDate: "2024-02-24",
        },
        {
          id: 2,
          spotId: 3,
          Spot: {
            id: 3,
            ownerId: 3,
            address: " 2820 Industrial Dr",
            city: "Raleigh",
            state: "North Carolina",
            country: "United States of America",
            lat: 35.8163,
            lng: 78.6205,
            name: "The Ritz",
            description: "Puttin' on the Ritz!",
            price: 500,
            previewImage: "image url",
          },
          userId: 1,
          startDate: "2024-02-25",
          endDate: "2024-02-28",
        },
        {
          id: 3,
          spotId: 2,
          Spot: {
            id: 2,
            ownerId: 2,
            address: "987 Times Square",
            city: "New York City",
            state: "New York",
            country: "United States of America",
            lat: 40.758896,
            lng: -73.98513,
            name: "Times Square Penthouse",
            description: "It's Times Square baby!",
            price: 999,

            previewImage: "image url",
          },
          userId: 3,
          startDate: "2024-02-26",
          endDate: "2024-02-27",
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Bookings";

    return queryInterface.bulkDelete(options, {});
  },
};
