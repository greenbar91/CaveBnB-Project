"use strict";

const { ReviewImage } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}
module.exports = {
  async up(queryInterface, Sequelize) {
    await ReviewImage.bulkCreate(
      [
        {

          url: "image url1",
          reviewId: 1,
        },
        {

          url: "image url2",
          reviewId: 2,
        },
        {
          
          url: "image url3",
          reviewId: 3,
        },
      ],
      {validate:true}
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "ReviewImages";

    return queryInterface.bulkDelete(options, {});
  },
};
