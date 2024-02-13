const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  updateUser,
  deleteUser,
  verifyUser,
  testController,
  getUsers,
  resetPassword,
  resetPasswordSendEmail,
  softDeleteUser,
  unFreezeAccount,
  sendVerificationEmail,
} = require("../controllers/userController");
const { check } = require("express-validator");
const { protect } = require("../middleware/auth");

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
  registerUser
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
  loginUser
);

// Logout user
router.post("/logout", protect, logoutUser);

// Get Users
router.get("/", getUsers);

// Get user by ID
// This route also can use auth middleware, it is up to product owner
router.get("/:id", getUser);

// Update user by ID
router.put("/update/:id", protect, updateUser);

// Delete user by ID
router.delete("/delete/:id", protect, deleteUser);

// Soft delete user by ID
router.put("/freezeacount/:id", protect, softDeleteUser);

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
router.get("/a", protect, testController);

module.exports = router;
