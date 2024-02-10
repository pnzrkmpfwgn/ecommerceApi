const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  softDeleteUser
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

// Update user by ID
router.put("/update/:id", adminAuth, updateUser);

// Delete user by Id
router.delete("/delete/:id", adminAuth, deleteUser);

// Soft delete user by Id
router.post("/softdelete/:id",adminAuth,softDeleteUser);

module.exports = router;
