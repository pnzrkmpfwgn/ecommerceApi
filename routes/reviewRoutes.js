const express = require("express");
const router = express.Router();
const { protect} = require("../middleware/auth");

const {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview
} = require("../controllers/reviewController");

// Create a new wishlist
router.post("/create-review", protect, createReview);

// Get reviews by product ID as user
router.get("/get-reviews/:id", getReviews)

// Get a Review
router.get("/get-review/:id", getReview);

// Update a review
router.put("/update-review/:id", protect, updateReview);

// Delete a wishlist
router.delete("/delete-review/:id", protect, deleteReview);

module.exports = router;