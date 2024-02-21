const { DataTypes } = require("sequelize");
const sequelize = require("../database/db_connection");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

// Define the Product model
const Order = sequelize.define("Orders", {
  orderId: {
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
  paymentType:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  status:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  discountCode:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  taxAmount:{
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  trackingNumber:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  shippingAddress:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  orderDate:{
    type: DataTypes.DATE,
    allowNull: false,
  },
  deletedAt:{
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  }
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
