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
        { url: "https://i.imgur.com/L6nH0Ne.png", preview: true, spotId: 4 },
        { url: "https://i.imgur.com/3PLU4oy.png", preview: true, spotId: 5 },
        { url: "https://i.imgur.com/g40puAq.png", preview: true, spotId: 6 },
        { url: "https://i.imgur.com/S9sT4MG.png", preview: true, spotId: 7 },
        { url: "https://i.imgur.com/jFWunn5.png", preview: true, spotId: 8 },
        {
          url: "https://img.traveltriangle.com/blog/wp-content/uploads/2019/04/Blue_Grotto__Capri__Naples__Campania__Italy_-_panoramio_700x400-400x229.jpg",
          preview: true,
          spotId: 9,
        },
        {
          url: "https://assets.traveltriangle.com/blog/wp-content/uploads/2018/10/Eisriesenwelt-Cave.jpg",
          preview: true,
          spotId: 10,
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "SpotImages";

    return queryInterface.bulkDelete(options, {});
  },
};
