const { DataTypes } = require("sequelize");
const sequelize = require("../database/db_connection");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

// Define the Product model
const Wishlist = sequelize.define("Wishlists", {
  wishId: {
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
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
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
module.exports = Wishlist;
