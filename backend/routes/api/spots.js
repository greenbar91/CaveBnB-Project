// backend/routes/api/spot.js
const express = require("express");
const {
  Spot,
  SpotImage,
  User,
  Review,
  ReviewImage,
  Booking,
} = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const {

  formatAllDates,
} = require("../../utils/helper");

const {validationCheckDateErrors,validateNewBooking ,validateSpotBody,validateReviewBody} = require("../../utils/validation");


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
router.post(
  "/",
  validateSpotBody, async (req, res) => {
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
  }
);

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
      message: "Forbidden",
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
router.put(
  "/:spotId",
  validateSpotBody, requireAuth,
  async (req, res) => {
    const { spotId } = req.params;
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

    const findSpotById = await Spot.findByPk(spotId);

    if (!findSpotById) {
      return res.status(404).json({
        message: "Spot couldn't be found",
      });
    }

    if (findSpotById.ownerId !== req.user.id) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

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
  }
);

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
    return res.status(403).json({
      message: "Forbidden",
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
router.post(
  "/:spotId/reviews",
  validateReviewBody, requireAuth,
  async (req, res) => {
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

    const newReview = await Review.create({
      userId: req.user.id,
      spotId: spotId,
      review,
      stars,
    });

    formatAllDates(newReview)

    return res.status(201).json(newReview);
  }
);

//Get all Bookings for a Spot based on the Spot's id
router.get("/:spotId/bookings", requireAuth, async (req, res) => {
  const { spotId } = req.params;

  const findSpotById = await Spot.findByPk(spotId);

  if (!findSpotById) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  if (findSpotById.ownerId !== req.user.id) {
    const notOwnerBookings = await findSpotById.getBookings({
      attributes: ["spotId", "startDate", "endDate"],
    });

    formatAllDates(notOwnerBookings);

    return res.status(200).json({ Bookings: notOwnerBookings });
  }

  if (findSpotById.ownerId === req.user.id) {
    const ownerBookings = await findSpotById.getBookings({
      include: [{ model: User, attributes: ["id", "firstName", "lastName"] }],
    });

    formatAllDates(ownerBookings);

    return res.status(200).json({ Bookings: ownerBookings });
  }
});

//Create a Booking from a Spot based on the Spot's id
router.post(
  "/:spotId/bookings",
  validationCheckDateErrors,validateNewBooking,
  requireAuth,
  async (req, res) => {
    const { spotId } = req.params;
    const { startDate, endDate } = req.body;

    const findSpotById = await Spot.findByPk(spotId);

    if (!findSpotById) {
      return res.status(404).json({
        message: "Spot couldn't be found",
      });
    }

    if (findSpotById.ownerId === req.user.id) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const newBooking = await Booking.create({
      spotId: Number(spotId),
      userId: req.user.id,
      startDate,
      endDate,
    });

    formatAllDates(newBooking);

    return res.status(200).json(newBooking);
  }
);

module.exports = router;
