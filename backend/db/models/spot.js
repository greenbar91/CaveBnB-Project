"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    static associate(models) {
      Spot.belongsTo(models.User, {
        foreignKey: "ownerId",
        as: "Owner",
      });
      Spot.hasMany(models.SpotImage, {
        foreignKey: "spotId",
        as: "SpotImages",
      });
      Spot.hasMany(models.Review, { foreignKey: "spotId" });
      Spot.hasMany(models.Booking, { foreignKey: "spotId" });
    }
  }
  Spot.init(
    {
      ownerId: { type: DataTypes.INTEGER , allowNull: false },
      address: { type: DataTypes.STRING, allowNull: false },
      city: { type: DataTypes.STRING, allowNull: false },
      state: { type: DataTypes.STRING, allowNull: false },
      country: { type: DataTypes.STRING, allowNull: false },
      lat: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        validate: {
          min: -90,
          max: 90,
        },
      },
      lng: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        validate: {
          min: -180,
          max: 180,
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [2, 49]
        },
      },
      description: { type: DataTypes.STRING, allowNull: false },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
        },
      },
    },
    {
      sequelize,
      modelName: "Spot",

      defaultScope: {
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
    }
  );
  return Spot;
};
