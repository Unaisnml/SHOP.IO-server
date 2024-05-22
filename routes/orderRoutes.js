import express from "express";

const router = express.Router();
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPacked,
  updateOrderToShipped,
  updateOrderToDelivered,
  getOrders,
  
} from "../controllers/orderController.js";
import {
  checkOut,
  paymentVerification,
} from "../controllers/paymentController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/").post(protect, createOrder).get(protect, admin, getOrders);
router.post("/checkout", checkOut);
router.route("/verifyPayment").post(protect, paymentVerification);
router.get("/myorders", protect, getMyOrders);
router.get("/:id", protect, getOrderById);
router.route("/:id/pack").put(protect, admin, updateOrderToPacked);
router.route("/:id/ship").put(protect, admin, updateOrderToShipped);
router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);


export default router;
