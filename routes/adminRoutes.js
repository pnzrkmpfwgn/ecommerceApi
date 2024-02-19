const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getUsers,
  getVendors,
  getVendor,
  getUser,
  updateUser,
  updateVendor,
  deleteUser,
  deleteVendor,
  softDeleteUser,
  softDeleteVendor,
  unFreezeAccount,
  unFreezeVendor,
  resetPasswordSendEmail,
} = require("../controllers/adminController");
const { adminAuth } = require("../middleware/adminAuth");

// Register a new user
router.post(
  "/register",
  [
    check("username", "Username is required").not().isEmpty(),
    check("name", "Name is required").not().isEmpty(),
    check("surname", "Surname is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  registerAdmin
);

// Login user
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  loginAdmin
);

// Logout user
router.post("/logout", adminAuth, logoutAdmin);

// Get Users
router.get("/", adminAuth, getUsers);

// Get user by ID
router.get("/:id", adminAuth, getUser);

// Get Vendors
router.get("/get/vendors", adminAuth, getVendors);

// Get Vendor by ID
router.get("/vendor/:id", adminAuth, getVendor);

// Update user by ID
router.put("/update/:id", adminAuth, updateUser);

// Update vendor by ID
router.put("/update/vendor/:id", adminAuth, updateVendor);

// Delete user by Id
router.delete("/delete/:id", adminAuth, deleteUser);

// Delete Vendor by ID
router.delete("/delete/vendor/:id", adminAuth, deleteVendor);

// Soft delete user by Id
router.put("/softdelete/:id",adminAuth,softDeleteUser);

// Soft delete vendor by ID
router.put("/softdelete/vendor/:id",adminAuth,softDeleteVendor);

// Unfreeze User by Id
router.put("/unfreeze/:id",adminAuth,unFreezeAccount);

// Unfreeze Vendor by Id
router.put("/unfreezevendor/:id",adminAuth,unFreezeVendor);

// Send Password Reset Email as admin
router.post("/sendpasswordresetemail", adminAuth,resetPasswordSendEmail);

module.exports = router;
