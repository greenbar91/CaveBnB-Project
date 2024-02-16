"use strict";

const {Spot, SpotImage } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await SpotImage.bulkCreate(
      [
        {
          id: 1,
          url: "image url",
          preview: true,
          SpotImages: 1,
        },
        { id: 2, url: "image url", preview: false, SpotImages: 1 },
        { id: 3, url: "image url", preview: true, SpotImages: 2 },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "SpotImages";

    return queryInterface.bulkDelete(options, {});
  },
};
