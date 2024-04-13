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
          spotId: 1,
          Spot: {
            ownerId: 1,
            address: "123 Mammoth Cave",
            city: "Mammoth Cave",
            state: "Kentucky",
            country: "United States of America",
            lat: 37.7645358,
            lng: -122.4730327,
            name: "Mammoth Cave",
            description: "Longest cave system in the world. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean libero leo, ultrices quis pharetra ut, posuere eget risus. Sed a vestibulum nibh. Maecenas ultricies augue sit amet enim pretium, non consectetur libero laoreet. Curabitur at ullamcorper elit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse cursus porttitor lorem eu feugiat. Donec suscipit quam eget ipsum consequat tincidunt. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Maecenas mollis fringilla sollicitudin. Nunc sed dolor sit amet quam iaculis mollis eget ut ipsum. Sed tempus nibh vel ipsum ultricies tristique.",
            price: 123,
          },
          userId: 2,
          startDate: "2025-02-21",
          endDate: "2025-02-24",
        },
        {
          spotId: 3,
          Spot:  {
            ownerId: 3,
            address: " 2820 Staffa Island",
            city: "Fingal's Cave",
            state: "Staffa Island",
            country: "Scotland",
            lat: 35.8163,
            lng: 78.6205,
            name: "Fingal's Cave",
            description:
              "Well known for its hexagonal basalt columns. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean libero leo, ultrices quis pharetra ut, posuere eget risus. Sed a vestibulum nibh. Maecenas ultricies augue sit amet enim pretium, non consectetur libero laoreet. Curabitur at ullamcorper elit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse cursus porttitor lorem eu feugiat. Donec suscipit quam eget ipsum consequat tincidunt. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Maecenas mollis fringilla sollicitudin. Nunc sed dolor sit amet quam iaculis mollis eget ut ipsum. Sed tempus nibh vel ipsum ultricies tristique.",
            price: 500,
          },
          userId: 1,
          startDate: "2025-02-25",
          endDate: "2025-02-28",
        },
        {
          spotId: 2,
          Spot: {
            ownerId: 2,
            address: "987 Blue Grotto",
            city: "Blue Grotto",
            state: "Capri Island",
            country: "Italy",
            lat: 40.758896,
            lng: -73.98513,
            name: "Blue Grotto",
            description: "A Brilliant blue lake! Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean libero leo, ultrices quis pharetra ut, posuere eget risus. Sed a vestibulum nibh. Maecenas ultricies augue sit amet enim pretium, non consectetur libero laoreet. Curabitur at ullamcorper elit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse cursus porttitor lorem eu feugiat. Donec suscipit quam eget ipsum consequat tincidunt. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Maecenas mollis fringilla sollicitudin. Nunc sed dolor sit amet quam iaculis mollis eget ut ipsum. Sed tempus nibh vel ipsum ultricies tristique.",
            price: 999,
          },
          userId: 3,
          startDate: "2025-02-26",
          endDate: "2025-02-27",
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
