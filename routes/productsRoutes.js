const express = require("express");
const router = express.Router();
const { adminAuth } = require("../middleware/adminAuth");
const {
  createProductAdmin,
  getProductAdmin,
  getProductByIDAdmin,
  updateProductByIDAdmin,
  softDeleteProductByIDAdmin
} = require("../controllers/productController");

// Create products as admin
router.post("/admincreateproduct", adminAuth, createProductAdmin);

// Get products as admin
router.get("/admingetproducts", adminAuth, getProductAdmin);

// Get product by ID as admin
router.get("/admingetproduct/:id", adminAuth, getProductByIDAdmin);

// Update product by ID as admin
router.put("/adminupdateproduct/:id", adminAuth, updateProductByIDAdmin);

// Soft Delete product by ID as admin
router.put("/adminsoftdeleteproduct/:id", adminAuth, softDeleteProductByIDAdmin);

module.exports = router;
