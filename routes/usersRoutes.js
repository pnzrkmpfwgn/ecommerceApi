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
  testController
} = require("../controllers/userController");
const { check } = require("express-validator");
const {auth} = require("../middleware/auth");

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
router.post("/logout/:id", logoutUser);

// Get user by ID
router.get("/:id", getUser);

// Update user by ID
router.put("/:id", updateUser);

// Delete user by ID
router.delete("/:id", deleteUser);

// Verify user by ID
router.get("/verify/:token", verifyUser);

//Test Route with token
router.get("/",auth,testController);

module.exports = router;
