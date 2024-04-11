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
          url: "https://i.imgur.com/DBgV2V5.png",
          preview: true,
          spotId: 1,
        },
        { url: "image url", preview: false, spotId: 1 },
        { url: "https://i.imgur.com/qhAU4XD.png", preview: true, spotId: 2 },
        { url: "https://i.imgur.com/522eiiS.png", preview: true, spotId: 3 },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "SpotImages";

    return queryInterface.bulkDelete(options, {});
  },
};
