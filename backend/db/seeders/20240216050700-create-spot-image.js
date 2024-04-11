"use strict";
// import image from '../images/cave1.png'

const { SpotImage } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await SpotImage.bulkCreate(
      [
        {
          url: "../images/cave1.png",
          preview: true,
          spotId: 1,
        },
        { url: "image url", preview: false, spotId: 1 },
        { url: "../images/cave2.png", preview: true, spotId: 2 },
        { url: "../images/cave3.png", preview: true, spotId: 3 },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "SpotImages";

    return queryInterface.bulkDelete(options, {});
  },
};
