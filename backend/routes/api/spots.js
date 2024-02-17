// backend/routes/api/spot.js
const express = require("express");
const { Spot, SpotImage, User } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");

const router = express.Router();

//Get all Spots
router.get("/", async (req, res) => {
  const allSpots = await Spot.findAll();

  return res.status(200).json(allSpots);
});

//Get all Spots owned by the Current User
router.get("/current", async (req, res) => {
  const currentUserSpots = await Spot.findAll({
    where: {
      ownerId: req.user.id,
    },
  });

  return res.status(200).json(currentUserSpots);
});

//Get details of a Spot from an id
router.get("/:spotId", async (req, res) => {
  const { spotId } = req.params;

  const specifiedSpot = await Spot.findByPk(spotId, {
    include: [
      {
        model: SpotImage,
        as: "SpotImages",
        attributes: ["id", "url", "preview"],
      },
      {
        model: User,
        as: "Owner",
        attributes: ["id", "firstName", "lastName"],
      },
    ],
  });

  if (specifiedSpot) {
    return res.status(200).json(specifiedSpot);
  }

  if (!specifiedSpot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }
});

//Create a Spot
router.post("/", async (req, res) => {
  try {
    const {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    } = req.body;

    const newSpot = await Spot.create({
      ownerId: req.user.id,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    });
    return res.status(201).json(newSpot);
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Bad Request",
        errors: {
          city: "City is required",
          address: "Street address is required",
          state: "State is required",
          country: "Country is required",
          lat: "Latitude must be within -90 and 90",
          lng: "Longitude must be within -180 and 180",
          name: "Name must be less than 50 characters",
          description: "Description is required",
          price: "Price per day must be a positive number",
        },
      });
    }
  }
});

//Add an Image to a Spot based on the Spot's id
router.post("/:spotId/images", requireAuth, async (req, res) => {
  const { spotId } = req.params;
  const { url, preview } = req.body;

  const findSpotById = await Spot.findByPk(spotId);

  if (!findSpotById) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  if (findSpotById && findSpotById.ownerId === req.user.id) {
    const newSpotImage = await SpotImage.create({
      url,
      preview,
      spotId,
    });

    const { id, url: imageUrl, preview: imagePreview } = newSpotImage;

    const responseBody = {
      id,
      url: imageUrl,
      preview: imagePreview,
    };

    return res.status(200).json(responseBody);
  }

  return res.json(400).json({
    message: "Spot must belong to you in order to add an image",
  });
});

module.exports = router;
