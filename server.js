const express = require("express");
const dotenv = require("dotenv");
const app = express();
const port = 3000;
const { Sequelize } = require("sequelize");
const userRoutes = require("./routes/usersRoutes");
const productRoutes = require("./routes/productsRoutes");
const adminRoutes = require("./routes/adminRoutes");
const vendorRoutes = require("./routes/vendorRoutes");

// Load config
dotenv.config({ path: "./.env" });

// Set up a new database connection
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
  }
);

// Test the connection
sequelize
  .authenticate()
  .then(() => console.log("Connection has been establishedp successfully."))
  .catch((error) => console.error("Unable to connect to the database:", error));

//Body parser
app.use(express.json());

// Set up routes for your API
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/vendors", vendorRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Export the sequelize connection
module.exports = sequelize;
