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
const { formatAllDates } = require("../../utils/helper");
const { Op } = require("sequelize");

const {
  validationCheckDateErrors,
  validateNewBooking,
  validateSpotBody,
  validateReviewBody,
  validateSpotQueryFilters,
} = require("../../utils/validation");

const router = express.Router();


//Get All Spots with Query filters
//!Need to add avgRating and previewImage
router.get("/?", validateSpotQueryFilters, async (req, res) => {
  let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } =
    req.query;

  page = Number(page);
  size = Number(size);

  if (page === "" || isNaN(page) ) {
    page = 1;
  }
  if (page > 10) {
    page = 10;
  }
  if (size === "" || size > 20 || isNaN(size)) {
    size = 20;
  }
  const queryFilter = {};

  if (minLat && maxLat) {
    queryFilter.lat = {
      [Op.between]: [parseFloat(minLat), parseFloat(maxLat)],
    };
  } else if (minLat && !maxLat) {
    queryFilter.lat = { [Op.gte]: parseFloat(minLat) };
  } else if (maxLat && !minLat) {
    queryFilter.lat = { [Op.lte]: parseFloat(maxLat) };
  }

  if (minLng && maxLng) {
    queryFilter.lng = {
      [Op.between]: [parseFloat(minLng), parseFloat(maxLng)],
    };
  } else if (minLng && !maxLng) {
    queryFilter.lng = { [Op.gte]: parseFloat(minLng) };
  } else if (maxLng && !minLng) {
    queryFilter.lng = { [Op.lte]: parseFloat(maxLng) };
  }

  if (minPrice && maxPrice) {
    queryFilter.price = {
      [Op.between]: [parseFloat(minPrice), parseFloat(maxPrice)],
    };
  } else if (minPrice && !maxPrice) {
    queryFilter.price = { [Op.gte]: parseFloat(minPrice) };
  } else if (maxPrice && !minPrice) {
    queryFilter.price = { [Op.lte]: parseFloat(maxPrice) };
  }

  const filteredSpots = await Spot.findAll({
    where: queryFilter,
    limit: size,
    offset: size * (page - 1),
  });

  if (!filteredSpots) {
    return res.status(200).json({
      message: "No spots currently listed",
    });
  }

  formatAllDates(filteredSpots)

  return res
    .status(200)
    .json({ Spots: filteredSpots, page: page, size: filteredSpots.length });
});


//Get all Spots owned by the Current User
//!Need to add avgRating and previewImage
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

  formatAllDates(currentUserSpots)

  return res.status(200).json(currentUserSpots);
});

//Get details of a Spot from an id
router.get("/:spotId", async (req, res) => {
  const { spotId } = req.params;

  const specifiedSpot = await Spot.findByPk(spotId, {
    include: [
      {
        model: SpotImage,

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

    formatAllDates(specifiedSpot)
    return res.status(200).json(specifiedSpot);

});

//Create a Spot
router.post("/",requireAuth, validateSpotBody, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

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

    formatAllDates(newSpot)


  return res.status(201).json(newSpot);
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
router.put("/:spotId", requireAuth, validateSpotBody, async (req, res) => {
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

  formatAllDates(spotToUpdate)
  return res.status(200).json(spotToUpdate);
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
    return res.status(403).json({
      message: "Forbidden",
    });
  }

  await findSpotById.destroy();

  return res.status(200).json({
    message: "Successfully deleted",
  });
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
  formatAllDates(findReviewBySpotId)
  return res.status(200).json({ Reviews: findReviewBySpotId });
});

//Create a Review for a Spot based on the Spot's id
router.post(
  "/:spotId/reviews",
  requireAuth,
  validateReviewBody,
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

    formatAllDates(newReview);

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
  requireAuth,
  validationCheckDateErrors,
  validateNewBooking,
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
