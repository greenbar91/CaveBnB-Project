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

  //*Testing params*
  // fetch('/api/spots', {
  //   method: 'GET',
  //   headers: {
  //     "Content-Type": "application/json",
  //     "XSRF-TOKEN": `<Insert token here>`
  //   },
  // }).then(res => res.json()).then(data => console.log(data));
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

  //*Testing params*
  // fetch('/api/spots/current', {
  //   method: 'GET',
  //   headers: {
  //     "Content-Type": "application/json",
  //     "XSRF-TOKEN": `<Insert token here>`
  //   },
  // }).then(res => res.json()).then(data => console.log(data));
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

  //*Testing params*
  // fetch('/api/spots/1', {
  //   method: 'GET',
  //   headers: {
  //     "Content-Type": "application/json",
  //     "XSRF-TOKEN": `<Insert token here>`
  //   },
  // }).then(res => res.json()).then(data => console.log(data));
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

  //*Testing params*
  // fetch('/api/spots', {
  //   method: 'POST',
  //   headers: {
  //     "Content-Type": "application/json",
  //     "XSRF-TOKEN": `<Insert token here>`
  //   },
  //   body: JSON.stringify({
  //   address: "123 Disney Lane",
  //   city: "San Francisco",
  //   state: "California",
  //   country: "United States of America",
  //   lat: 37.7645358,
  //   lng: -122.4730327,
  //   name: "App Academy",
  //   description: "Place where web developers are created",
  //   price: 123
  // })
  // }).then(res => res.json()).then(data => console.log(data));
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

  //*Testing params*
  // fetch('/api/spots/1/images', {
  //   method: 'POST',
  //   headers: {
  //     "Content-Type": "application/json",
  //     "XSRF-TOKEN": `<Insert token here>`
  //   },
  //   body: JSON.stringify({
  //   url: "image url",
  //   preview: true
  // })
  // }).then(res => res.json()).then(data => console.log(data));
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

  //*Testing params*
  // fetch('/api/spots/1', {
  //   method: 'PUT',
  //   headers: {
  //     "Content-Type": "application/json",
  //     "XSRF-TOKEN": `<Insert token here>`
  //   },
  //   body: JSON.stringify({
  //   address: "1223 Disney Lane",
  //   city: "San Francisco",
  //   state: "California",
  //   country: "United States of America",
  //   lat: 37.7645358,
  //   ln: -122.4730327,
  //   name: "App Academy",
  //   description: "Place where web developers are created",
  //   price: 123
  // })
  // }).then(res => res.json()).then(data => console.log(data));
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

  //*Testing params*
  // fetch('/api/spots/1', {
  //   method: 'DELETE',
  //   headers: {
  //     "Content-Type": "application/json",
  //     "XSRF-TOKEN": `<Insert token here>`
  //   },
  // }).then(res => res.json()).then(data => console.log(data));
});

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

module.exports = router;
