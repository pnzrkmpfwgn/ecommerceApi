const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth");

const {
  addItemToCart,
  getCartItems,
  getCartItem,
  updateDescription,
  deleteCartItem
} = require("../controllers/cartController");

// Add Cart Items
router.post("/add-item", protect, addItemToCart);

// Get Cart Items
router.get("/get-cart-items/:id", protect, getCartItems);

// Get Cart Item
router.get("/get-cart-item/:id", protect, getCartItem);

// Update description in the cart items
router.put("/update-description", protect, updateDescription);

// Delete Cart Item
router.delete("/delete-cart-item", protect, deleteCartItem);

module.exports = router;
