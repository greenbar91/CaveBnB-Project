const express = require("express");
const { Spot, SpotImage } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const router = express.Router();

//!Replace all 403/404 error checks in associated endpoints with new validations in utils/validation
//--------------------------------------------------------------------------------------//
//                                 Delete a Spot Image                                  //
//--------------------------------------------------------------------------------------//
router.delete(
  "/:imageId",
  requireAuth,
  async (req, res, next) => {
    const { imageId } = req.params;

    const findImageById = await SpotImage.findByPk(imageId);

    if (!findImageById) {
      return res.status(404).json({
        message: "Spot Image couldn't be found",
      });
    }

    const findSpotBySpotId = await Spot.findByPk(findImageById.spotId);

    if (findSpotBySpotId.ownerId !== req.user.id) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }
    next();
  },
  async (req, res) => {
    const { imageId } = req.params;

    const findImageById = await SpotImage.findByPk(imageId);

    await findImageById.destroy();

    return res.status(200).json({
      message: "Successfully deleted",
    });
  }
);

module.exports = router;
