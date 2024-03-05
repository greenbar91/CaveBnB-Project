const express = require("express");
const { Review, ReviewImage } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const router = express.Router();

//!Replace all 403/404 error checks in associated endpoints with new validations in utils/validation
//--------------------------------------------------------------------------------------//
//                                Delete a Review Image                                 //
//--------------------------------------------------------------------------------------//
router.delete(
  "/:imageId",
  requireAuth,
  async (req, res, next) => {
    const { imageId } = req.params;

    const findImageById = await ReviewImage.findByPk(imageId);

    if (!findImageById) {
      return res.status(404).json({
        message: "Review Image couldn't be found",
      });
    }

    const findReviewByReviewId = await Review.findByPk(findImageById.reviewId);

    if (findReviewByReviewId.userId !== req.user.id) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }
    next();
  },
  async (req, res) => {
    const { imageId } = req.params;

    const findImageById = await ReviewImage.findByPk(imageId);

    await findImageById.destroy();

    return res.status(200).json({
      message: "Successfully deleted",
    });
  }
);

module.exports = router;
