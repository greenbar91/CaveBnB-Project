const express = require("express");
const { Spot, Booking, SpotImage } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { formatAllDates } = require("../../utils/helper");
const {
  validationCheckDateErrors,
  validateEditBooking,
} = require("../../utils/validation");

const router = express.Router();

router.delete("/:imageId", requireAuth, async (req, res) => {
  const { imageId } = req.params;

  const findImageById = await SpotImage.findByPk(imageId);

  const findSpotBySpotId = await Spot.findByPk(findImageById.spotId);

  if (!findImageById) {
    return res.status(404).json({
      message: "Spot Image couldn't be found",
    });
  }

  if (findSpotBySpotId.ownerId !== req.user.id) {
    return res.status(403).json({
      message: "Forbidden",
    });
  }

  await findImageById.destroy();

  return res.status(200).json({
    message: "Successfully deleted",
  });
});

module.exports = router;
