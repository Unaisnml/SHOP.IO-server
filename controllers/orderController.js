import { asyncHandler } from "../middleware/asyncHandler.js";
import { Order } from "../models/orderModel.js";
import { Product } from "../models/productModel.js";
import { calcPrices } from "../utils/calculatePrice.js";

// @desc   Create new Order
// @route  POST api/orders
// @access private

const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    paymentInfo,
    isPaid,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;
  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items found");
  } else {
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

    // calculate prices
    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(dbOrderItems);

    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paymentInfo,
      isPaid: true,
    });
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

const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json(orders);
};

// @desc   Get loggedIn user order by Id
// @route  GET api/orders/:id
// @access Private

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc   Update order to packed
// @route  PUT api/orders/:id/pack
// @access Private/Admin

const updateOrderToPacked = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id);
  if (order) {
    order.isPacked = true;
    order.packedAt = Date.now();
    const updatedOrder = order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc   Update order to shipped
// @route  PUT api/orders/:id/ship
// @access Private/Admin

const updateOrderToShipped = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id);
  if (order) {
    order.isShipped = true;
    order.shippedAt = Date.now();
    const updatedOrder = order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc   Update order to delivered
// @route  PUT api/orders/:id/deliver
// @access Private/Admin

const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc   Get all orders
// @route  GET api/orders
// @access Private/Admin

const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "id name");
  if (orders) {
    res.status(200).json(orders);
  } else {
    res.status(404);
    throw new Error("No orders found");
  }
});


export {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPacked,
  updateOrderToShipped,
  updateOrderToDelivered,
  getOrders,
};
