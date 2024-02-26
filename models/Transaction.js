const { DataTypes } = require("sequelize");
const sequelize = require("../database/db_connection");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

// Define the Product model
const Order = sequelize.define("Transactions", {
  transactionId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  orderId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  paymentType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

// Sync the model with the database
(async () => {
  try {
    await sequelize.sync();
    console.log("Order model synced successfully");
  } catch (error) {
    console.error("Error syncing Order model:", error);
  }
})();

// Export the Order model
module.exports = Order;
