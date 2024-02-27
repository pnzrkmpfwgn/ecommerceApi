const { DataTypes } = require("sequelize");
const sequelize = require("../database/db_connection");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

// Define the Product model
const Cart = sequelize.define("Cart", {
  cartItemId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  vendorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  productId:{
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

// Sync the model with the database
(async () => {
  try {
    await sequelize.sync();
    console.log("Cart model synced successfully");
  } catch (error) {
    console.error("Error syncing Cart model:", error);
  }
})();

// Export the Cart model
module.exports = Cart;
