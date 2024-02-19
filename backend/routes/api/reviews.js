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

//Get all Reviews of the Current User
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
      },
      {
        model: ReviewImage,
        attributes: ["id", "url"],
      },
    ],
  });

  return res.status(200).json({ Reviews: allCurrentReviews });
});

//Add an Image to a Review based on the Review's id
router.post("/:reviewId/images", requireAuth, async (req, res) => {
  const { reviewId } = req.params;
  const { url } = req.body;

  const findReviewById = await Review.findByPk(reviewId);

  if (!findReviewById) {
    return res.status(404).json({
      message: "Review couldn't be found",
    });
  }

  if (findReviewById.userId !== req.user.id) {
    return res.status(400).json({
      message: "Unauthorized to add an image to this review",
    });
  }

  const totalImagesForReview = await ReviewImage.count({ where: { reviewId } });

  if (totalImagesForReview >= 10) {
    return res.status(403).json({
      message: "Maximum number of images for this resource was reached",
    });
  }

  try {
    const newReviewImage = await ReviewImage.create({ url, reviewId });

    return res.status(200).json({
      id: newReviewImage.id,
      url: newReviewImage.url,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unexpected error adding image",
    });
  }
});

module.exports = router;
