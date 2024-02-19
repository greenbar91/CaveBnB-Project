// backend/routes/api/spot.js
const express = require("express");
const {
  Spot,
  SpotImage,
  User,
  Review,
  ReviewImage,
} = require("../../db/models");
const { requireAuth } = require("../../utils/auth");

const router = express.Router();

//Get all Spots
router.get("/", async (req, res) => {
  const allSpots = await Spot.findAll();

  if (!allSpots) {
    return res.status(200).json({
      message: "No spots currently listed",
    });
  }

  if (allSpots) {
    return res.status(200).json(allSpots);
  }
});

//Get all Spots owned by the Current User
router.get("/current", requireAuth, async (req, res) => {
  const currentUserSpots = await Spot.findAll({
    where: {
      ownerId: req.user.id,
    },
  });

  if (!currentUserSpots) {
    return res.status(200).json({
      message: "You don't have any spots listed",
    });
  }

  if (currentUserSpots) {
    return res.status(200).json(currentUserSpots);
  }
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

  if (!specifiedSpot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  if (specifiedSpot) {
    return res.status(200).json(specifiedSpot);
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

  if (findSpotById.ownerId !== req.user.id) {
    return res.status(403).json({
      message: "Unauthorized to add an image to this spot",
    });
  }

  if (findSpotById) {
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
});

//Edit a Spot
router.put("/:spotId", requireAuth, async (req, res) => {
  const { spotId } = req.params;
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  const findSpotById = await Spot.findByPk(spotId);

  if (!findSpotById) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  if (findSpotById.ownerId !== req.user.id) {
    return res.status(403).json({
      message: "Unauthorized to edit this spot",
    });
  }

  try {
    const spotToUpdate = await findSpotById.update({
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

    return res.status(200).json(spotToUpdate);
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

//Delete a Spot
router.delete("/:spotId", requireAuth, async (req, res) => {
  const { spotId } = req.params;

  const findSpotById = await Spot.findByPk(spotId);

  if (!findSpotById) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  if (findSpotById.ownerId !== req.user.id) {
    return res.status(400).json({
      message: "Unauthorized to delete this spot",
    });
  }

  if (findSpotById) {
    await findSpotById.destroy();

    return res.status(200).json({
      message: "Successfully deleted",
    });
  }
});

//Get all Reviews by a Spot's id
router.get("/:spotId/reviews", async (req, res) => {
  const { spotId } = req.params;

  const findSpotById = await Spot.findByPk(spotId);

  if (!findSpotById) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  const findReviewBySpotId = await findSpotById.getReviews({
    include: [
      { model: User, attributes: ["id", "firstName", "lastName"] },
      {
        model: ReviewImage,
        attributes: ["id", "url"],
      },
    ],
  });

  return res.status(200).json({ Reviews: findReviewBySpotId });
});

//Create a Review for a Spot based on the Spot's id
router.post("/:spotId/reviews", requireAuth, async (req, res) => {
  const { spotId } = req.params;
  const { review, stars } = req.body;

  const findSpotById = await Spot.findByPk(spotId);

  if (!findSpotById) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  const existingReview = await Review.findOne({
    where: {
      spotId: spotId,
      userId: req.user.id,
    },
  });

  if (existingReview) {
    return res.status(500).json({
      message: "User already has a review for this spot",
    });
  }

  try {
    const newReview = await Review.create({
      userId: req.user.id,
      spotId: spotId,
      review,
      stars,
    });

    return res.status(201).json(newReview);
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Bad Request",
        errors: {
          review: "Review text is required",
          stars: "Stars must be an integer from 1 to 5",
        },
      });
    }
  }
});



module.exports = router;
