const Wishlist = require("../models/Wishlist");
const User = require("../models/User");
const Product = require("../models/Product");

const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

// set wishlist as User
const createWishlist = async (req, res) => {
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

    const { productId, notes, vendorType, vendorID } = req.body;

    const wishlist = await Wishlist.create({
      userId,
      productId,
      notes,
      vendorType,
      vendorID,
    });

    res.status(201).json({ msg: "Wishlist Created", wishlist: wishlist });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

// Get all wishlists
// This route can be custimized further to support anonymous or private access to wishlist
// For now I am keeping it simple and made it private
const getWishlists = async (req, res) => {
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

    const wishlists = await Wishlist.findAll({
      where: { userId: decoded.id },
    });
    res.status(200).json({ wishlists: wishlists });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

// Update notes of the wishlist
const updateWishlist = async (req, res) => {
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
    const { notes } = req.body;
    const wishId = req.params.id;

    const wishlist = await Wishlist.findOne({
      where: { userId: decoded.id, wishId: wishId },
    });
    if (!wishlist) {
      return res.status(404).json({ msg: "Wishlist not found" });
    }
    await Wishlist.update(
      { notes: notes },
      { where: { userId: decoded.id, wishId: wishId } }
    );

    res.status(200).json({ msg: "Note is updated" });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

// Delete Wish from wishlist
// for brevity this deletes wishes one by one 
// there can be a controller where a set of wishes can be deleted
const deleteWish = async (req, res) => {
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
    const wishId = req.params.id;

    const wishlist = await Wishlist.findOne({
      where: { userId: decoded.id, wishId: wishId },
    });
    if (!wishlist) {
      return res.status(404).json({ msg: "Wishlist not found" });
    }
    await Wishlist.destroy({ where: { userId: decoded.id, wishId: wishId } });

    res.status(200).json({ msg: "Wish is deleted" });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

// Export the controllers
module.exports = {
  createWishlist,
  getWishlists,
  updateWishlist,
  deleteWish,
};
