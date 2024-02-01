const User = require("../models/User");
const { validationResult } = require('express-validator');
const sendEmail = require("../utils/sendEmail");

// Register a new user
const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({error: errors.array()});
  }
  try {
    // Get user data from request body
    const { username, name, surname, dob, msisdn, email, password } = req.body;

    // Create a new user instance
    const newUser = new User({
      username,
      name,
      surname,
      dob,
      msisdn,
      email,
      password,
    });

    // Save the user to the database
    await newUser.save();

    // TO DO: Send a welcome SMS to the user
    // TO DO: Send a welcome email to the user

    const user = await User.findOne({ email });
    const token = user.token;

    // Commented out for now.
    // await sendEmail(
    //   newUser.email,
    //   "Welcome to E-Commerce",
    //   "Please confirm your email address by clicking the link below",
    //   `
    //         <h1>Welcome to E-Commerce</h1>
    //         <p>Please confirm your email address by clicking the link below</p>
    //         <br />
    //         <a href="http://localhost:3000/api/users/verify/${token}">Confirm Email</a>
    //         `
    // );

    res.status(201).json({
      message: "User registered successfully, Confirmation mail sent",
      token: token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login user
const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({error: errors.array()});
  }
  try {
    // Get user credentials from request body
    const { email, password } = req.body;

    // Find the user in the database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the password is correct
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate and return a JWT token for authentication
    const token = user.token;

    res.status(200).json({ msg: "User logged in successfully", token: token });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to login", msg: error.message, details: error });
  }
};

// Logout user
const logoutUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByPk(userId);
    console.log("Before ",user.token)
    user.token = null;
    await user.save();
    console.log("After ",user.token)

    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to logout", msg: error.message, details: error });
  }
};

// Get user by ID
const getUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the user in the database by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to get user" });
  }
};

// Update user by ID
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;

    // Find the user in the database by ID and update the data
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
};

const deleteUser = async (req, res) => {
  //TODO: Implement delete user logic here
};

const verifyUser = async (req, res) => {
  try {
    if (!req.params.token) {
      return res.status(400).json({ error: "Invalid token" });
    }

    const user = await User.findOne({ token: req.params.token });
    if (!user) {
      return res.status(400).json({ error: "Invalid token" });
    } else {
      user.isVerified = true;
      user.token = null;

      const newToken = user.token;

      user.token = newToken;
      await user.save();
      return res
        .status(200)
        .json({ message: "User verified successfully", token: newToken });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


// Test Controller
const testController = async (req, res) => {
  try {
    res.status(200).json({ msg: "Test controller works" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  updateUser,
  deleteUser,
  verifyUser,

  testController
};
