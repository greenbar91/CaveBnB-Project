const express = require("express");
const {
  Spot,
  SpotImage,
  User,
  Review,
  ReviewImage,
} = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { validateReviewBody } = require("../../utils/validation");
const { formatAllDates,formatLatLng } = require("../../utils/helper");

const router = express.Router();

//--------------------------------------------------------------------------------------//
//                         Get all Reviews of the Current User                          //
//--------------------------------------------------------------------------------------//
router.get("/current", requireAuth, async (req, res) => {
  const allCurrentReviews = await Review.findAll({
    where: {
      userId: req.user.id,
    },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: Spot,
        attributes: [
          "id",
          "ownerId",
          "address",
          "city",
          "state",
          "country",
          "lat",
          "lng",
          "name",
          "price",
          "previewImage",
        ],
      },
      {
        model: ReviewImage,
        attributes: ["id", "url"],
      },
    ],
  });

  /* N+1 query to add previewImage to Spots */
  for (const review of allCurrentReviews) {
    const imagePreview = await SpotImage.findOne({
      where: {
        spotId: review.Spot.id,
        preview: true,
      },
    });

    if (imagePreview) {
      review.Spot.previewImage = imagePreview.url;
    } else {
      delete review.Spot.dataValues.previewImage;
    }
  }

  formatAllDates(allCurrentReviews);
  formatLatLng(allCurrentReviews)
  return res.status(200).json({ Reviews: allCurrentReviews });
});

//--------------------------------------------------------------------------------------//
//                  Add an Image to a Review based on the Review's id                   //
//--------------------------------------------------------------------------------------//
router.post(
  "/:reviewId/images",
  requireAuth,
  async (req, res, next) => {
    const { reviewId } = req.params;
    const findReviewById = await Review.findByPk(reviewId);
    const totalImagesForReview = await ReviewImage.count({
      where: { reviewId },
    });

    if (!findReviewById) {
      return res.status(404).json({
        message: "Review couldn't be found",
      });
    }

    if (findReviewById.userId !== req.user.id) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    if (totalImagesForReview >= 10) {
      return res.status(403).json({
        message: "Maximum number of images for this resource was reached",
      });
    }
    next();
  },
  async (req, res) => {
    const { url } = req.body;
    const { reviewId } = req.params;
    const newReviewImage = await ReviewImage.create({ url, reviewId });

    return res.status(200).json({
      id: newReviewImage.id,
      url: newReviewImage.url,
    });
  }
);

//--------------------------------------------------------------------------------------//
//                                    Edit a Review                                     //
//--------------------------------------------------------------------------------------//
router.put(
  "/:reviewId",
  requireAuth,
  async (req, res, next) => {
    const { reviewId } = req.params;
    const findReviewById = await Review.findByPk(reviewId);

    if (!findReviewById) {
      return res.status(404).json({
        message: "Review couldn't be found",
      });
    }

    if (findReviewById.userId !== req.user.id) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }
    next();
  },
  validateReviewBody,
  async (req, res) => {
    const { reviewId } = req.params;
    const { review, stars } = req.body;

    const findReviewById = await Review.findByPk(reviewId);

    const updatedReview = await findReviewById.update({
      review,
      stars,
    });

    formatAllDates(updatedReview);

    return res.status(200).json(updatedReview);
  }
);

//--------------------------------------------------------------------------------------//
//                                   Delete a Review                                    //
//--------------------------------------------------------------------------------------//
router.delete(
  "/:reviewId",
  requireAuth,
  async (req, res, next) => {
    const { reviewId } = req.params;

    const findReviewById = await Review.findByPk(reviewId);

    if (!findReviewById) {
      return res.status(404).json({
        message: "Review couldn't be found",
      });
    }

    if (findReviewById.userId !== req.user.id) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }
    next();
  },
  async (req, res) => {
    const { reviewId } = req.params;

    const findReviewById = await Review.findByPk(reviewId);

    await findReviewById.destroy();

    return res.status(200).json({
      message: "Successfully deleted",
    });
  }
);

module.exports = router;
