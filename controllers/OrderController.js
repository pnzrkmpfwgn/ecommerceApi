const Order = require("../models/Order");
const dotenv = require("dotenv");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const sendEmail = require("../utils/sendEmail");

dotenv.config({ path: "./.env" });

// get all orders by Customer ID
const getOrdersByCustomerID = async (req, res) => {
  const customerId = req.params.id;
  try {
    const orders = await Order.findAll({
      where: {
        customerId: customerId,
      },
      atributtes: [
        "orderId",
        "vendorId",
        "amount",
        "price",
        "description",
        "paymentType",
        "status",
        "discountCode",
        "shippingAddress",
        "orderDate",
      ],
    });
    if (orders.length === 0) {
      res.status(404).json({ msg: "No Orders Found" });
    }
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// Get order by order Id
const getOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({ msg: "No Order Was Found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// Order a product by produt Id a customer
const orderProduct = async (req, res) => {
  const {
    customerId,
    vendorId,
    productId,
    amount,
    price,
    description,
    paymentType,
    status,
    discountCode,
    shippingAddress,
  } = req.body;
  const randomNumber = Math.floor(Math.random() * 1000);
  const time = new Date().getTime();
  const trackingNumber = `${customerId}${randomNumber}${time}`;
  const taxAmount = price * 0.1;
  const orderDate = new Date();
  try {
    const order = await Order.create({
      customerId,
      vendorId,
      productId,
      amount,
      price,
      description,
      paymentType,
      status,
      discountCode,
      taxAmount,
      trackingNumber,
      shippingAddress,
      orderDate,
    });

    // Send Email to the customer
    // const user = await User.findByPk(customerId);
    // const email = user.email;
    // const subject = "Order Confirmation";
    // const message = `Your order has been confirmed. Your tracking number is ${trackingNumber}.`;
    // const msisdn = user.msisdn;
    // Commented out for now.
    // await sendEmail(
    //   email,
    //   subject,
    //   message,
    //   `
    //         <h1>Thank you for your purchase</h1>
    //         <p>Your order has been received</p>
    //         <p>Your tracking number is ${trackingNumber}</p>
    //         <p>Your order will be shipped to the following address:${shippingAddress}</p>
    //         <p>You will be notified through this email and ${msisdn} phone number</p>
    //         <p>Thank you for shopping with us</p>
    //         `
    // );

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// Cancel order
const cancelOrder = async (req, res) => {
  const {orderId} = req.body;

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
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    const order = await Order.findOne({
      where: { customerId: user.id, orderId: orderId },
    });
    if (!order) {
      return res.status(404).json({ msg: "No Order Was Found" });
    }
    if (order.status === "Cancelled") {
      return res.status(400).json({ msg: "Order already cancelled" });
    }
    await Order.update(
      { status: "Cancelled" },
      {
        where: { orderId: orderId },
      }
    );
    /*
     Send email if necessary
     await sendEmail(
       email,
       subject,
       message,
       `
             <h1>Thank you for your purchase</h1>
             <p>Your order has been received</p>
             <p>Your tracking number is ${trackingNumber}</p>
             <p>Your order will be shipped to the following address:${shippingAddress}</p>
             <p>You will be notified through this email and ${msisdn} phone number</p>
             <p>Thank you for shopping with us</p>
             `
     );
      */
    res.status(200).json({ msg: "Order Cancelled" });
  } catch (error) {
    res.status(500).json({ error: error.msg });
  }
};

// Get all orders as admin
const getOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.findAll();
    if (orders.length === 0) {
      res.status(404).json({ msg: "No Orders Found" });
    }
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// Get all orders by vendor, customer, order id as admin
const getOrdersByIDs = async (req, res) => {
  try {
    const { type, vendorId, customerId, orderId } = req.body;
    let orders;
    switch (type) {
      case "vendor":
        orders = await Order.findAll({
          where: {
            vendorId: vendorId,
          },
        });
        if (orders.length === 0) {
          res.status(404).json({ msg: "No Orders Found" });
        }
        return res.status(200).json(orders);
      case "customer":
        orders = await Order.findAll({
          where: {
            customerId: customerId,
          },
        });
        if (orders.length === 0) {
          res.status(404).json({ msg: "No Orders Found" });
        }
        return res.status(200).json(orders);
      case "order":
        orders = await Order.findAll({
          where: {
            orderId: orderId,
          },
        });
        if (orders.length === 0) {
          res.status(404).json({ msg: "No Orders Found" });
        }
        return res.status(200).json(orders);
      default:
        return res.status(400).json({ msg: "Invalid type" });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// change order status as admin
const changeOrderStatus = async (req, res) => {
  const {trackingNumber,status} = req.body;
  try {
    const order = await Order.findOne({
      where: { trackingNumber: trackingNumber },
    });
    if (!order) {
      return res.status(404).json({ msg: "No Order Was Found" });
    }
    await Order.update(
      { status: status },
      {
        where: { trackingNumber: trackingNumber},
      }
    );
    res.status(200).json({ msg: "Order Status Changed" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// Update Shipping Address
const updateShippingAddress = async (req, res) => {
  const { trackingNumber, shippingAddress } = req.body;
  try {
    const order = await Order.findOne({
      where: { trackingNumber: trackingNumber },
    });
    if(!order){
      return res.status(404).json({msg: "No Order Was Found"});
    }
    await Order.update(
      { shippingAddress: shippingAddress },
      {
        where: { trackingNumber: trackingNumber },
      });
      res.status(200).json({msg: "Shipping Address Updated"});
    }catch (error) {
      res.status(500).json({ error: error });
    }
}

// Update Description
const updateDescription = async (req, res) => {
  const { trackingNumber, description } = req.body;
  try {
    const order = await Order.findOne({
      where: { trackingNumber: trackingNumber },
    });
    if(!order){
      return res.status(404).json({msg: "No Order Was Found"});
    }
    await Order.update(
      { description: description },
      {
        where: { trackingNumber: trackingNumber },
      });
      res.status(200).json({msg: "Description Updated"});
    }catch (error) {
      res.status(500).json({ error: error });
    }
}


// Export the controllers
module.exports = {
  getOrder,
  getOrdersByCustomerID,
  orderProduct,
  cancelOrder,
  getOrdersAdmin,
  getOrdersByIDs,
  changeOrderStatus,
  updateShippingAddress,
  updateDescription
};
