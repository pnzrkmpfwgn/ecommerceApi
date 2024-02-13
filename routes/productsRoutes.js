const express = require("express");
const router = express.Router();
const { adminAuth } = require("../middleware/adminAuth");
const {
  createProductAdmin,
  getProductAdmin,
  getProductByIDAdmin,
  updateProductByIDAdmin,
  softDeleteProductByIDAdmin,
  recoverProductByIDAdmin,
  permaDeleteProductByIDAdmin,
  getProducts,
  getProduct
} = require("../controllers/productController");

// Create products as admin
router.post("/admincreateproduct", adminAuth, createProductAdmin);

// Get products as admin
router.get("/admingetproducts", adminAuth, getProductAdmin);

// Get product by ID as admin
router.get("/admingetproduct/:id", adminAuth, getProductByIDAdmin);

// Get Products as user
router.get("/getproducts", getProducts);

// Get Product by ID as user
router.get("/getproduct/:id", getProduct);

// Update product by ID as admin
router.put("/adminupdateproduct/:id", adminAuth, updateProductByIDAdmin);

// Soft Delete product by ID as admin
router.put("/adminsoftdeleteproduct/:id", adminAuth, softDeleteProductByIDAdmin);

// Recover product by ID as admin
router.put("/adminrecoverproduct/:id", adminAuth, recoverProductByIDAdmin);

// Permanent Delete product by ID as admin
router.delete("/deleteproductadmin/:id", adminAuth, permaDeleteProductByIDAdmin);

module.exports = router;
