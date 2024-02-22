const { DataTypes } = require("sequelize");
const sequelize = require("../database/db_connection");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

// Define the Product model
const Review = sequelize.define("Reviews", {
  reviewId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId:{
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  productId:{
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  review: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  rating:{
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  vendorType:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  vendorID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// Sync the model with the database
(async () => {
  try {
    await sequelize.sync();
    console.log("Wishlist model synced successfully");
  } catch (error) {
    console.error("Error syncing Wishlist model:", error);
  }
})();

// Export the Product model
module.exports = Review;
