"use strict";

const { Review } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Review.bulkCreate(
      [
        {
          userId: 1,
          spotId: 3,
          review: "This was an awesome spot!",
          stars: 5.0,
          createdAt: "2023-11-19 20:39:36",
          updatedAt: "2023-11-19 20:39:36",
        },
        {
          userId: 2,
          spotId: 1,
          review: "Meh",
          stars: 3.0,
          createdAt: "2023-11-20 20:39:36",
          updatedAt: "2023-11-20 20:39:36",
        },
        {
          userId: 3,
          spotId: 2,
          review: "Nice Spot!",
          stars: 4.0,
          createdAt: "2023-11-21 20:39:36",
          updatedAt: "2023-11-21 20:39:36",
        },
        {
          userId: 2,
          spotId: 4,
          review: "This was an awesome spot!",
          stars: 4.4,
          createdAt: "2023-11-19 20:39:36",
          updatedAt: "2023-11-19 20:39:36",
        },
        {
          userId: 3,
          spotId: 5,
          review: "This was an awesome spot!",
          stars: 4.2,
          createdAt: "2023-11-19 20:39:36",
          updatedAt: "2023-11-19 20:39:36",
        },
        {
          userId: 2,
          spotId: 6,
          review: "This was an awesome spot!",
          stars: 4.7,
          createdAt: "2023-11-19 20:39:36",
          updatedAt: "2023-11-19 20:39:36",
        },
        {
          userId: 3,
          spotId: 7,
          review: "This was an awesome spot!",
          stars: 4.8,
          createdAt: "2023-11-19 20:39:36",
          updatedAt: "2023-11-19 20:39:36",
        },
        {
          userId: 2,
          spotId: 8,
          review: "This was an awesome spot!",
          stars: 4.9,
          createdAt: "2023-11-19 20:39:36",
          updatedAt: "2023-11-19 20:39:36",
        },
        {
          userId: 3,
          spotId: 9,
          review: "This was an awesome spot!",
          stars: 4.1,
          createdAt: "2023-11-19 20:39:36",
          updatedAt: "2023-11-19 20:39:36",
        },

      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Reviews";

    return queryInterface.bulkDelete(options, {});
  },
};
