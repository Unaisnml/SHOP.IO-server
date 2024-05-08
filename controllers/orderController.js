import { asyncHandler } from "../middleware/asyncHandler.js";
import { Order } from "../models/orderModel.js";
import { Product } from "../models/productModel.js";
import { calcPrices } from "../utils/calculatePrice.js";

// @desc   Create new Order
// @route  POST api/orders
// @access private

const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;
  console.log("orderItems............", req.body);
  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items found");
  } else {
    // console.log(
    //   "neeeed to create order here....................................."
    // );

    // get the ordered items from our database
    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x) => x._id) },
    });

    // map over the order items and use the price from our items from database
    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
      );
      return {
        ...itemFromClient,
        product: itemFromClient._id,
        price: matchingItemFromDB.price,
        _id: undefined,
      };
    });

    // console.log(".......dbOrderItems........", dbOrderItems);

    // calculate prices
    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(dbOrderItems);
    // console.log(
    //   "itemsPrice:",
    //   itemsPrice,
    //   " taxPrice:",
    //   taxPrice,
    //   " shippingPrice:",
    //   shippingPrice,
    //   " totalPrice:",
    //   totalPrice
    // );

    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });
    console.log(shippingAddress);
    try {
      const createdOrder = await order.save();
      console.log("createdOrder:", createdOrder);
      res.status(201).json(createdOrder);
    } catch (error) {
      console.error("Error saving order:", error);
      res.status(500).json({ error: "Failed to save order" });
    }
  }
});

// @desc   Get loggedIn user orders
// @route  GET api/orders/myorders
// @access Private

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json(orders);
});

// @desc   Get loggedIn user order by Id
// @route  GET api/orders/:id
// @access Private

const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.param.id;
  const order = await Order.findById(id).populate("user", "name email");
  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc   Update order to paid
// @route  PUT api/orders/:id/pay
// @access Private

const updateOrderToPaid = asyncHandler(async (req, res) => {
  res.send("update order to paid");
});

// @desc   Update order to delivered
// @route  PUT api/orders/:id/deliver
// @access Private/Admin

const updateOrderToDelivered = asyncHandler(async (req, res) => {
  res.send("update order to delivered");
});

// @desc   Get all orders
// @route  GET api/orders
// @access Private/Admin

const getOrders = asyncHandler(async (req, res) => {
  res.send("get all orders");
});

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
};
