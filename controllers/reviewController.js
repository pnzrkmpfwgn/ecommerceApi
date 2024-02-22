const Review = require("../models/Review");
const User = require("../models/User");

const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

// set wishlist as User
const createReview = async (req, res) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      //Set token from Bearer token in header
      token = req.headers.authorization.split(" ")[1];
      //Set token from cookie
    } /*else if (req.cookies.token) {
          token = req.cookies.token;
        }*/

    //Make sure that token exists
    if (!token) {
      return next(
        new ErrorResponse("Not authorized to access this route", 401)
      );
    }

    //Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);
    const userId = user.dataValues.id;

    const { productId, review, rating, vendorType, vendorID } = req.body;

    const userReview = await Review.create({
      userId,
      productId,
      review,
      rating,
      vendorType,
      vendorID,
    });

    res.status(201).json({ msg: "Review sent", review: userReview });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

// Get all Reviews by product ID as user
// This route can be custimized further to support anonymous or private access to wishlist
// For now I am keeping it simple and made it private
const getReviews = async (req, res) => {
  try {
    const productId = req.params.id;

    const reviews = await Review.findAll({
      where: { productId: productId },
    });

    if (reviews.length === 0) {
      return res.status(404).json({ msg: "No reviews found" });
    }

    res.status(200).json({ reviews: reviews });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

// Get review by review ID as User
const getReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const review = await Review.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({ msg: "Review not found" });
    }
    res.status(200).json({ review: review });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

// Update review by review ID as User
const updateReview = async (req, res) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      //Set token from Bearer token in header
      token = req.headers.authorization.split(" ")[1];
      //Set token from cookie
    } /*else if (req.cookies.token) {
        token = req.cookies.token;
      }*/

    //Make sure that token exists
    if (!token) {
      return next(
        new ErrorResponse("Not authorized to access this route", 401)
      );
    }
    //Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { review, rating } = req.body;
    const reviewId = req.params.id;

    const userReview = await Review.findOne({
      where: { userId: decoded.id, reviewId: reviewId },
    });
    if (!userReview) {
      return res.status(404).json({ msg: "Review not found" });
    }
    await Review.update(
      { review: review, rating: rating },
      { where: { userId: decoded.id, reviewId: reviewId } }
    );

    res.status(200).json({ msg: "Review is updated" });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

// Delete Review by review ID as User
const deleteReview = async (req, res) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      //Set token from Bearer token in header
      token = req.headers.authorization.split(" ")[1];
      //Set token from cookie
    } /*else if (req.cookies.token) {
        token = req.cookies.token;
      }*/

    //Make sure that token exists
    if (!token) {
      return next(
        new ErrorResponse("Not authorized to access this route", 401)
      );
    }
    //Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const reviewId = req.params.id;

    const review = await Review.findOne({
      where: { userId: decoded.id, reviewId: reviewId },
    });
    if (!review) {
      return res.status(404).json({ msg: "Review not found" });
    }
    await Review.destroy({ where: { userId: decoded.id, reviewId: reviewId } });

    res.status(200).json({ msg: "Review is deleted" });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

// Export the controllers
module.exports = {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
};
