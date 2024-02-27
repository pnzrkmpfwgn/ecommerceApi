const dotenv = require("dotenv");
const User = require("../models/User");
const Cart = require("../models/Cart");

dotenv.config({ path: "./.env" });

// Add Item to the cart
const addItemToCart = async (req, res) => {
  // For simplicity customerId is passed in the body
  // It can be send via auth token
  const { customerId, vendorId, productId, amount, price, description } =
    req.body;
  try {
    const user = await User.findByPk(customerId);
    if (!user) {
      return res.status(404).json({ msg: "No User Found" });
    }
    const cart = await Cart.create({
      customerId,
      vendorId,
      productId,
      amount,
      price,
      description,
    });
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// Get Cart Items as User
const getCartItems = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ msg: "No User Found" });
    }
    const cart = await Cart.findAll({
      where: {
        customerId:id,
      },
    });
    if(cart.length === 0){
      return res.status(404).json({msg:"No items in the cart"})
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// Get One Cart Item as User
const getCartItem = async(req,res)=>{
    try{
        const cart = await Cart.findByPk(req.params.id);
        if(!cart){
            return res.status(404).json({msg:"No Cart Item Found"})
        }
        res.status(200).json(cart)
    }catch(error){
        return res.status(500).json({error:error})
    }
}

// Update the description of the cart item
const updateDescription = async (req, res) => {
  const { cartItemId, description } = req.body;
  try {
    const cart = await Cart.findByPk(cartItemId);
    if (!cart) {
      return res.status(404).json({ msg: "No Cart Item Found" });
    }
    cart.update(
      { description: description }
    );
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// Delete the cart item
const deleteCartItem = async(req,res)=>{
    const {cartItemId} = req.body;
    try{
        const cart = await Cart.findByPk(cartItemId);
        if(!cart){
            return res.status(404).json({msg:"No Cart Item Found"})
        }
        cart.destroy();
        res.status(200).json({msg:"Cart Item Deleted"})
    }catch(error){
        res.status(500).json({error:error})
    }
}

// Note : Delete all Items might be implemented in the future

// Remove Item from the cart if the item is purchased
// As the transaction testing is not possible at the time 
// This function will not be implemented to the server to be used
// After the transaction is tested, this function will be implemented
// And probably this api won't be public since it should be automatically
// called after the transaction is complete.
const afterTransactionItemRemoval = async(req,res)=>{
    const {cartItemId} = req.body;
    try{
        const cart = await Cart.findByPk(cartItemId);
        if(!cart){
            return res.status(404).json({msg:"No Cart Item Found"})
        }
        cart.destroy();
        res.status(200).json({msg:"Cart Item Deleted"})
    }catch(error){
        res.status(500).json({error:error})
    }
}

// Export the controllers
module.exports = {
  addItemToCart,
  getCartItems,
  getCartItem,
  updateDescription,
  deleteCartItem
};
