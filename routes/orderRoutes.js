const express = require("express");
const router = express.Router();
const { adminAuth } = require("../middleware/adminAuth");
const { protect } = require("../middleware/auth");
const {
  getOrdersByCustomerID,
  getOrder,
  orderProduct,
  cancelOrder,
  getOrdersAdmin,
  getOrdersByIDs,
  changeOrderStatus,
  updateShippingAddress,
  updateDescription
} = require("../controllers/OrderController");

// Get Orders by Customer ID
router.get("/get-orders/:id", protect, getOrdersByCustomerID);

// Get all orders
router.get("/get-order/:id", protect, getOrder);

// Order product
router.post("/order-product", protect, orderProduct);

// Cancel order
router.put("/cancel-order", protect, cancelOrder);

// Get all orders as admin
router.get("/get-all-orders", adminAuth, getOrdersAdmin);

// Get orders by vendor, customer or order id as admin
router.post("/get-orders-admin", adminAuth, getOrdersByIDs);

// Update order as admin
router.put("/change-order-status", adminAuth, changeOrderStatus);

// Update shipping address
router.put("/update-shipping-address",adminAuth, updateShippingAddress);

// Update Description as admin
router.put("/update-description", adminAuth, updateDescription);

module.exports = router;
