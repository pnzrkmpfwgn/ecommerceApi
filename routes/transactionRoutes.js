const express = require("express");
const router = express.Router();
const { adminAuth } = require("../middleware/adminAuth");
const { protect } = require("../middleware/auth");