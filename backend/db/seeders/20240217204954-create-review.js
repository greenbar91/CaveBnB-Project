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
          spotId: 1,
          review: "This was an awesome spot!",
          stars: 5,
          createdAt: "2023-11-19 20:39:36",
          updatedAt: "2023-11-19 20:39:36",
        },
        {

          userId: 2,
          spotId: 2,
          review: "Meh",
          stars: 3,
          createdAt: "2023-11-20 20:39:36",
          updatedAt: "2023-11-20 20:39:36",
        },
        {
         
          userId: 3,
          spotId: 3,
          review: "Nice Spot!",
          stars: 4,
          createdAt: "2023-11-21 20:39:36",
          updatedAt: "2023-11-21 20:39:36",
        },
      ],
      {validate:true}
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Reviews";

    return queryInterface.bulkDelete(options, {});
  },
};
