const Product = require("../models/Product");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

// Set Product as Admin
// This controller should be modified to fit the storage system that uses this api
// For now it is created in a basic form
const createProductAdmin = async (req, res) => {
  try {
    const {
      name,
      imageUrl,
      price,
      quantityInStock,
      category,
      description,
      vendor,
    } = req.body;

    const product = await Product.create({
      name,
      imageUrl,
      price,
      quantityInStock,
      category,
      description,
      vendor,
    });

    res.status(201).json({ msg: "Product Created", product: product });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

// Get Proudct List as admin
const getProductAdmin = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  try {
    const users = await Product.findAll({
      limit: limit,
      offset: 0,
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// Get Product by ID as admin
const getProductByIDAdmin = async (req, res) => {
  try {
    const productId = req.params.id;

    // Find the user in the database by ID
    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to get product", msg: error.message });
  }
};

// Get Products
const getProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    // Find all the products in the database
    const product = await Product.findAll(
      {
        limit: limit,
        offset: 0,
        order: [["createdAt", "DESC"]],
        where:{deletedAt: null}
      }
    );

    if (!product) {
      return res.status(404).json({ error: "There Are no products." });
    }

    res.status(200).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to get products", msg: error.message });
  }
};

// Get Product by ID as User
const getProduct = async (req,res)=>{
  try {
    const productId = req.params.id;

    // Find the user in the database by ID
    const product = await Product.findByPk(productId);

    if (!product || product.deletedAt !== null) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to get product", msg: error.message });
  }
}

// Update Produt by ID as admin
const updateProductByIDAdmin = async (req, res) => {
  try {
    const productId = req.params.id;
    const updateData = req.body;

    const [numberOfAffectedRows, affectedRows] = await Product.update(
      updateData,
      {
        where: { productId: productId },
        returning: true, // needed for affectedRows to be populated
      }
    );

    if (numberOfAffectedRows < 1) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(affectedRows);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update product", msg: error.message });
  }
};

// Soft Delete Product by ID as admin
const softDeleteProductByIDAdmin = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: "User not found" });
    }
    product.update({ deletedAt: new Date() });
    return res.status(200).json({ msg: "Product soft deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to soft delete product", msg: error.message });
  }
};

// Perma Delete Product by ID as admin
const permaDeleteProductByIDAdmin = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: "User not found" });
    }
    product.destroy();
    return res.status(200).json({ msg: "Product perma deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to perma delete product", msg: error.message });
  }
};

// Recover Product by ID as admin
const recoverProductByIDAdmin = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: "User not found" });
    }
    product.update({ deletedAt: null });
    return res.status(200).json({ msg: "Product recovered" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to recover product", msg: error.message });
  }
};

// Export the controllers
module.exports = {
  createProductAdmin,
  getProductAdmin,
  getProductByIDAdmin,
  getProducts,
  getProduct,
  updateProductByIDAdmin,
  softDeleteProductByIDAdmin,
  recoverProductByIDAdmin,
  permaDeleteProductByIDAdmin,
};
