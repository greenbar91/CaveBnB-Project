const express = require("express");
const { Spot, SpotImage, User } = require("../../db/models");

const router = express.Router();

//Get all the spots
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

module.exports = router;
