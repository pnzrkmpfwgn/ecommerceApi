const express = require("express");
const router = express.Router();
const { protect} = require("../middleware/auth");

const {
  createWishlist,
  getWishlists,
  updateWishlist,
  deleteWish
} = require("../controllers/wishlistController");

// Create a new wishlist
router.post("/create-wishlist", protect, createWishlist);

// Get all wishlists as user
router.get("/get-wishlists", protect, getWishlists)

// Update a wishlist
router.put("/update-wishlist/:id", protect, updateWishlist);

// Delete a wishlist
router.delete("/delete-wish/:id", protect, deleteWish);

module.exports = router;