const Product = require("../models/Product");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

//Get User List
const getProducts = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    console.log("users");
    try {
      const users = await User.findAll({
        limit: limit,
        offset: 0,
        order: [["createdAt", "DESC"]],
        attributes: ["username", "name", "surname"],
      });
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error });
    }
};

module.exports = {
    getProducts
}