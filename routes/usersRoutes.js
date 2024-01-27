const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    logoutUser,
    getUser,
    updateUser,
} = require('../controllers/userController');

// Register a new user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Logout user
router.post('/logout', logoutUser);

// Get user by ID
router.get('/:id', getUser);

// Update user by ID
router.put('/:id', updateUser);

module.exports = router;