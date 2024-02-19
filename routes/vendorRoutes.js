const express = require("express");
const router = express.Router();
const {
  registerVendor,
  loginVendor,
  logoutVendor,
  updateVendor,
  deleteUser,
  verifyUser,
  testController,
  resetPassword,
  resetPasswordSendEmail,
  softDeleteVendor,
  unFreezeAccount,
  sendVerificationEmail,
  getVendors,
  getVendor,
} = require("../controllers/vendorController");
const { getUser, getUsers } = require("../controllers/userController");
const { check } = require("express-validator");
const { vendorAuth } = require("../middleware/vendorAuth");

// Register a new user
router.post(
  "/register",
  [
    check("username", "Username is required").not().isEmpty(),
    check("name", "Name is required").not().isEmpty(),
    check("surname", "Surname is required").not().isEmpty(),
    check("dob", "Date of birth is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  registerVendor
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
  loginVendor
);

// Logout user
router.post("/logout", vendorAuth, logoutVendor);

// Get users
router.get("/get/users", getUsers);

// Get user by ID
router.get("/get/user/:id", getUser);

// Get Vendors
router.get("/", getVendors);

// Get vendor by ID
// This route also can use auth middleware, it is up to product owner
router.get("/:id", getVendor);

// Update user by ID
router.put("/update/:id", vendorAuth, updateVendor);

// Delete user by ID
router.delete("/delete/:id", vendorAuth, deleteUser);

// Soft delete user by ID
router.put("/freezeacount/:id", vendorAuth, softDeleteVendor);

// Unfreeze Account by email
router.put("/unfreezeaccount", unFreezeAccount);

// Verify user by ID
router.get("/verify/:token", verifyUser);

// Send Email Verification On demand by user
router.post("/send-email-verification", sendVerificationEmail);

// Send email for password change
router.post("/reset-password-send-email", resetPasswordSendEmail);

// Reset Password
router.post("/reset-password/:token", resetPassword);

//Test Route with token
router.get("/a", vendorAuth, testController);

module.exports = router;
