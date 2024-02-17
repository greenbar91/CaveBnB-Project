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
          id: 1,
          userId: 1,
          spotId: 1,
          review: "This was an awesome spot!",
          stars: 5,
        },
        {
          id: 2,
          userId: 2,
          spotId: 2,
          review: "Meh",
          stars: 3,
        },
        {
          id: 3,
          userId: 3,
          spotId: 3,
          review: "Nice Spot!",
          stars: 4,
        },
      ],
      {validate: true}
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Reviews";

    return queryInterface.bulkDelete(options, {});
  },
};
