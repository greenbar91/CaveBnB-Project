"use strict";

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
          url: "image url spot1",
          preview: true,
          spotId: 1,
        },
        { url: "image url", preview: false, spotId: 1 },
        { url: "image url spot2", preview: true, spotId: 2 },
        { url: "image url spot3", preview: true, spotId: 3 },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "SpotImages";

    return queryInterface.bulkDelete(options, {});
  },
};
