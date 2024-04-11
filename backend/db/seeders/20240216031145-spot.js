"use strict";

const { Spot } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Spot.bulkCreate(
      [
        {
          ownerId: 1,
          address: "123 Mammoth Cave",
          city: "Mammoth Cave",
          state: "Kentucky",
          country: "United States of America",
          lat: 37.7645358,
          lng: -122.4730327,
          name: "Mammoth Cave",
          description: "Longest cave system in the world",
          price: 123,
        },
        {
          ownerId: 2,
          address: "987 Blue Grotto",
          city: "Blue Grotto",
          state: "Capri Island",
          country: "Italy",
          lat: 40.758896,
          lng: -73.98513,
          name: "Blue Grotto",
          description: "A Brilliant blue lake!",
          price: 999,
        },
        {
          ownerId: 3,
          address: " 2820 Staffa Island",
          city: "Fingal's Cave",
          state: "Staffa Island",
          country: "Scotland",
          lat: 35.8163,
          lng: 78.6205,
          name: "Fingal's Cave",
          description: "Well known for its hexagonal basalt columns",
          price: 500,
        },
        {
          ownerId: 1,
          address: "123 Carlsbad Caverns",
          city: "San Diego",
          state: "California",
          country: "United States of America",
          lat: 51.5074,
          lng: -122.4730327,
          name: "Lechuguilla cave",
          description: "Check out Big Room Trail!",
          price: 576,
        },{
          ownerId: 1,
          address: "123 Waitomo ",
          city: "Waitomo",
          state: "Glowworm caves",
          country: "New Zealand",
          lat: -22.9068,
          lng: -122.4730327,
          name: "Waitomo",
          description: "See the starry night inside!",
          price: 274,
        },{
          ownerId: 1,
          address: "123 Skocjan Caves",
          city: "Skocjan",
          state: "Karst",
          country: "Slovenia",
          lat: 48.8566,
          lng: -122.4730327,
          name: "Skocjan Caves",
          description: "Awe-inspiring stalactites",
          price: 954,
        },{
          ownerId: 1,
          address: "123 Reed Flute Cave",
          city: "Guillan",
          state: "Xongsia",
          country: "China",
          lat: -33.8688,
          lng: -122.4730327,
          name: "Reed Flute Cave",
          description: "Also known as the Palace of Natural Arts",
          price: 184,
        },{
          ownerId: 1,
          address: "123 Cave of the Crystals",
          city: "Mexico City",
          state: "Mexico City",
          country: "Mexico",
          lat: 55.7558,
          lng: -122.4730327,
          name: "Cave of the Crystals",
          description: "Giant selenite crystals",
          price: 464,
        },{
          ownerId: 1,
          address: "123 Eisriesenwelt Cave",
          city: "Salzach",
          state: "Salzburg",
          country: "Austria",
          lat: 19.0760,
          lng: -122.4730327,
          name: "Eisriesenwelt Cave",
          description: "Largest ice cave in the world",
          price: 467,
        },{
          ownerId: 1,
          address: "123 Hang Son Doong Cave",
          city: "Hanoi",
          state: "Hanoi",
          country: "Vietnam",
          lat: 34.0522,
          lng: -122.4730327,
          name: "Hang Son Doong Cave",
          description: "Amazing speleothems!",
          price: 745,
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Spots";

    return queryInterface.bulkDelete(options, {});
  },
};
