const User = require("../models/User");
const { validationResult } = require("express-validator");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

// Test Everything before doing anything here!!!
// TODO: Username should not contain special characters

// Register a new user
const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
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

    const user = await User.findOne({ where: { email: email } });
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
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  try {
    // Get user credentials from request body
    const { email, password } = req.body;

    // Find the user in the database
    const user = await User.findOne({
      where: { email: email },
      attributes: ["id", "username", "name", "surname", "password"],
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Check if the password is correct
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    //Generate jwt token
    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "5 days" }
    );

    res.status(200).json({ msg: "User logged in successfully", token: token });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to login", msg: error.message, details: error });
  }
};

// Logout user
const logoutUser = async (req, res) => {
  console.log("Logged out");
  try {
    res.cookie("token", "none", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    return res.status(200).json({
      success: true,
      data: {},
    });
    // res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to logout", msg: error.message, details: error });
  }
};

//Get User List
const getUsers = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  try {
    const users = await User.findAll({
      limit: limit,
      offset: 0,
      order: [["createdAt", "DESC"]],
      attributes: ["username", "name", "surname"],
      where: {
        deletedAt: null,
      },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user by ID
// This countroller can have a protected route, but it is up to the product owner.
const getUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the user in the database by ID
    const user = await User.findByPk(userId, {
      attributes: ["username", "name", "surname", "deletedAt"],
    });

    if (!user || user.deletedAt !== null) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to get user", msg: error.message });
  }
};

// Update user by ID
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;

    const [numberOfAffectedRows, affectedRows] = await User.update(updateData, {
      where: { id: userId },
      returning: true, // needed for affectedRows to be populated
    });

    // The successfully updated user (if any)
    const updatedUser =
      affectedRows && numberOfAffectedRows > 0 ? affectedRows[0] : null;

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ msg: "Successfully updated" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update user", msg: error });
  }
};

// Delete user by ID
const deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    const numberOfDestroyedRows = await User.destroy({
      where: { id },
    });

    if (numberOfDestroyedRows > 0) {
      res.status(200).send({ msg: "User Deleted" }); // No Content
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

// Soft Delete user by ID (Freeze Account)
const softDeleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.update({ deletedAt: new Date() });
    res.status(200).json({ msg: "User Deleted" });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
  // TO DO: Add a logic for unfreezing the account after some time
};

// Unfreeze Account by email
// ! // This controller should be modified according to the frontend
const unFreezeAccount = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "5 days",
    });

    user.update({ deletedAt: null });
    res.status(200).json({ msg: "User Account Unfrozen",token: token});
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

// Verify user
const verifyUser = async (req, res) => {
  try {
    if (!req.params.token) {
      return res.status(400).json({ error: "Invalid token" });
    }

    const user = await User.findOne({ token: req.params.token });
    if (!user) {
      return res.status(400).json({ error: "Invalid token" });
    } else {
      await user.update({ isVerified: true });
      await user.update({ token: null });

      const newToken = user.token;

      await user.update({ token: newToken });

      await user.save();
      return res
        .status(200)
        .json({ message: "User verified successfully", token: newToken });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Reset Password Send Email
const resetPasswordSendEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  try {
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const token = jwt.sign({ userEmail: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log(token);
    res.status(200).json({ message: "Password reset link sent to your email" });
    await sendEmail(
      email,
      "Reset Password",
      "Please click the link below to reset your password",
      `
              <h1>Reset Password</h1>
              <p>Reset Password with below link</p>
              <p>If you didn't requested password reset ignore this email.</p>
              <br />
              <a href="http://localhost:3000/api/users/resetPassword/${token}">Reset Password</a>
              `
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const token = req.params.token;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ email: decoded.userEmail });
    // console.log("Decoded: ", decoded);
    if (!token) {
      return res.status(400).json({ error: "Invalid token" });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);
    await user.update({ password: password });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Error", error: error.message });
  }
};

// Test Controller
const testController = async (req, res) => {
  try {
    res.status(200).json({ msg: "authorized" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  softDeleteUser,
  unFreezeAccount,
  verifyUser,
  resetPassword,
  resetPasswordSendEmail,

  testController,
};
