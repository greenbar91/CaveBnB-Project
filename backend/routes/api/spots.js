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
const { formatAllDates, formatLatLng } = require("../../utils/helper");
const { Op } = require("sequelize");
const {
  validationCheckDateErrors,
  validateNewBooking,
  validateSpotBody,
  validateReviewBody,
  validateSpotQueryFilters,
} = require("../../utils/validation");
const router = express.Router();

//--------------------------------------------------------------------------------------//
//                           Get All Spots with Query filters                           //
//--------------------------------------------------------------------------------------//
router.get("/", validateSpotQueryFilters, async (req, res) => {
  let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } =
    req.query;

  /* Setting defaults for page/size and checking for isNaN */
  if (page === "" || isNaN(page)) {
    page = 1;
    page = Number(page);
  }
  if (page > 10) {
    page = 10;
  }
  if (size === "" || size > 20 || isNaN(size)) {
    size = 20;
    size = Number(size);
  }

  /* Adding query filters */
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

  /* Finding avgRating for all Spots */
  for (const spot of filteredSpots) {
    let totalStars = 0;
    let reviewCount = 0;

    const reviews = await Review.findAll({
      where: {
        spotId: spot.id,
      },
    });

    reviews.forEach((review) => {
      totalStars += review.stars;
      reviewCount++;
    });

    spot.avgRating = reviewCount > 0 ? totalStars / reviewCount : null;

    if (spot.avgRating === null) {
      delete spot.dataValues.avgRating;
    }
  }

  /* Finding previewImage for all Spots */
  for (const spot of filteredSpots) {
    const previewImages = await SpotImage.findOne({
      where: {
        spotId: spot.id,
      },
      preview: true,
    });

    if (previewImages) {
      spot.previewImage = previewImages.url;
    } else {
      delete spot.dataValues.previewImage;
    }
  }

  if (!filteredSpots) {
    return res.status(200).json({
      message: "No spots currently listed",
    });
  }
  // console.log(filteredSpots[2].dataValues.lat)
  formatAllDates(filteredSpots);
  formatLatLng(filteredSpots)

  return res.status(200).json({
    Spots: filteredSpots,
    page: Number(page),
    size: filteredSpots.length,
  });
});

//--------------------------------------------------------------------------------------//
//                       Get all Spots owned by the Current User                        //
//--------------------------------------------------------------------------------------//
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

  /* Finding avgRating for all Spots */
  for (const spot of currentUserSpots) {
    let totalStars = 0;
    let reviewCount = 0;

    const reviews = await Review.findAll({
      where: {
        spotId: spot.id,
      },
    });

    reviews.forEach((review) => {
      totalStars += review.stars;
      reviewCount++;
    });

    spot.avgRating = reviewCount > 0 ? totalStars / reviewCount : null;

  }

  /* Finding previewImage for all Spots */
  for (const spot of currentUserSpots) {
    const previewImages = await SpotImage.findOne({
      where: {
        spotId: spot.id,
      },
      preview: true,
    });

    if (previewImages) {
      spot.previewImage = previewImages.url;
    }
  }

  formatAllDates(currentUserSpots);
  formatLatLng(currentUserSpots)
  // console.log(currentUserSpots[0].toJSON())

  return res.status(200).json({ Spots: currentUserSpots });
});

//--------------------------------------------------------------------------------------//
//                           Get details of a Spot from an id                           //
//--------------------------------------------------------------------------------------//

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

  /* Finding avgRating for Spot */
  let totalStars = 0;
  let reviewCount = 0;

  const reviews = await Review.findAll({
    where: {
      spotId: specifiedSpot.id,
    },
  });

  reviews.forEach((review) => {
    totalStars += review.stars;
    reviewCount++;
  });

  specifiedSpot.avgRating = reviewCount > 0 ? totalStars / reviewCount : null;

  formatAllDates(specifiedSpot);
  formatLatLng(specifiedSpot)

  return res.status(200).json({
    id:specifiedSpot.id,
    ownerId:specifiedSpot.ownerId,
    address:specifiedSpot.address,
    city:specifiedSpot.city,
    state:specifiedSpot.state,
    country:specifiedSpot.country,
    lat:specifiedSpot.lat,
    lng:specifiedSpot.lng,
    name:specifiedSpot.name,
    description:specifiedSpot.description,
    price:specifiedSpot.price,
    createdAt:specifiedSpot.createdAt,
    updatedAt:specifiedSpot.updatedAt,
    numReviews:reviewCount,
    avgStarRating:specifiedSpot.avgRating,
    SpotImages: specifiedSpot.SpotImages,
    Owner: specifiedSpot.Owner
  });
});

//--------------------------------------------------------------------------------------//
//                                    Create a Spot                                     //
//--------------------------------------------------------------------------------------//
router.post("/", requireAuth, validateSpotBody, async (req, res) => {
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

  if (newSpot.avgRating === null) {
    delete newSpot.dataValues.avgRating;
  }
  if (newSpot.previewImage === null) {
    delete newSpot.dataValues.previewImage;
  }

  formatAllDates(newSpot);
  formatLatLng(newSpot)

  return res.status(201).json(newSpot);
});

//--------------------------------------------------------------------------------------//
//                    Add an Image to a Spot based on the Spot's id                     //
//--------------------------------------------------------------------------------------//
router.post(
  "/:spotId/images",
  requireAuth,
  async (req, res, next) => {
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
    next();
  },
  async (req, res) => {
    const { spotId } = req.params;
    const { url, preview } = req.body;

    const newSpotImage = await SpotImage.create({
      url,
      preview,
      spotId,
    });

    return res.status(200).json({
      id: newSpotImage.id,
      url: newSpotImage.url,
      preview: newSpotImage.preview,
    });
  }
);

//--------------------------------------------------------------------------------------//
//                                     Edit a Spot                                      //
//--------------------------------------------------------------------------------------//
router.put(
  "/:spotId",
  requireAuth,
  async (req, res, next) => {
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
    next();
  },
  validateSpotBody,
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

    if (spotToUpdate.avgRating === null) {
      delete spotToUpdate.dataValues.avgRating;
    }
    if (spotToUpdate.previewImage === null) {
      delete spotToUpdate.dataValues.previewImage;
    }

    formatAllDates(spotToUpdate);
    formatLatLng(spotToUpdate)

    return res.status(200).json(spotToUpdate);
  }
);

//--------------------------------------------------------------------------------------//
//                                    Delete a Spot                                     //
//--------------------------------------------------------------------------------------//
router.delete(
  "/:spotId",
  requireAuth,
  async (req, res, next) => {
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
    next();
  },
  async (req, res) => {
    const { spotId } = req.params;

    const findSpotById = await Spot.findByPk(spotId);

    await findSpotById.destroy();

    return res.status(200).json({
      message: "Successfully deleted",
    });
  }
);

//--------------------------------------------------------------------------------------//
//                            Get all Reviews by a Spot's id                            //
//--------------------------------------------------------------------------------------//
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

  formatAllDates(findReviewBySpotId);

  return res.status(200).json({ Reviews: findReviewBySpotId });
});

//--------------------------------------------------------------------------------------//
//                  Create a Review for a Spot based on the Spot's id                   //
//--------------------------------------------------------------------------------------//
router.post(
  "/:spotId/reviews",
  requireAuth,
  async (req, res, next) => {
    const { spotId } = req.params;
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
    next();
  },
  validateReviewBody,
  async (req, res) => {
    const { spotId } = req.params;
    const { review, stars } = req.body;

    const newReview = await Review.create({
      userId: req.user.id,
      spotId: Number(spotId),
      review,
      stars,
    });

    formatAllDates(newReview);

    return res.status(201).json(newReview);
  }
);

//--------------------------------------------------------------------------------------//
//                  Get all Bookings for a Spot based on the Spot's id                  //
//--------------------------------------------------------------------------------------//
router.get("/:spotId/bookings", requireAuth, async (req,res,next)=> {
  const { spotId } = req.params;

  const findSpotById = await Spot.findByPk(spotId);

  if (!findSpotById) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }
  next()
},async (req, res) => {
  const { spotId } = req.params;

  const findSpotById = await Spot.findByPk(spotId);

  /* Response sent if Spot is not owned by current user */
  if (findSpotById.ownerId !== req.user.id) {
    const notOwnerBookings = await findSpotById.getBookings({
      attributes: ["spotId", "startDate", "endDate"],
    });

    formatAllDates(notOwnerBookings);

    return res.status(200).json({ Bookings: notOwnerBookings });
  }

  /* Response sent if Spot is owned by current user */
  if (findSpotById.ownerId === req.user.id) {
    const ownerBookings = await findSpotById.getBookings({
      include: [{ model: User, attributes: ["id", "firstName", "lastName"] }],
    });

    formatAllDates(ownerBookings);

    return res.status(200).json({ Bookings: ownerBookings });
  }
});

//--------------------------------------------------------------------------------------//
//                 Create a Booking from a Spot based on the Spot's id                  //
//--------------------------------------------------------------------------------------//
router.post(
  "/:spotId/bookings",
  requireAuth,
  async(req,res,next)=> {
    const { spotId } = req.params;

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
    next()
  }
  ,
  validationCheckDateErrors,
  validateNewBooking,
  async (req, res) => {
    const { spotId } = req.params;
    const { startDate, endDate } = req.body;

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
