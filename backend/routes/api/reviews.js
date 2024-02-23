const express = require("express");
const { Spot, User, Review, ReviewImage } = require("../../db/models");
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
    return res.status(403).json({
      message: "Forbidden",
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

//Edit a Review
router.put(
  "/:reviewId",
  /*put validation middleware here*/ requireAuth,
  async (req, res) => {
    const { reviewId } = req.params;
    const { review, stars } = req.body;

    const findReviewById = await Review.findByPk(reviewId);

    if (!findReviewById) {
      return res.status(404).json({
        message: "Review couldn't be found",
      });
    }

    const updatedReview = await findReviewById.update({
      userId: req.user.id,
      review,
      stars,

    });

    updatedReview.dataValues.createdAt = updatedReview.dataValues.createdAt
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
    updatedReview.dataValues.updatedAt = updatedReview.dataValues.updatedAt
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

    return res.status(200).json(updatedReview);
  }
);

//Delete a Review
router.delete("/:reviewId", requireAuth, async (req, res) => {
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

  await findReviewById.destroy();

  return res.status(200).json({
    message: "Successfully deleted",
  });
});

module.exports = router;
