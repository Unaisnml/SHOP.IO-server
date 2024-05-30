import express from "express";
const router = express.Router();
import {
  getProducts,
  getProductById,
  createProduct,
  deleteProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
  searchProducts,
  getFilteredProducts,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { checkObjectId } from "../middleware/checkObjectId.js";

router.route("/").get(getProducts).post(protect, admin, createProduct);
router.route("/:id/reviews").post(protect, checkObjectId, createProductReview);
router.get("/top", getTopProducts);
router.get("/search", searchProducts);
router.get("/filter", getFilteredProducts);

router
  .route("/:id")
  .get(checkObjectId, getProductById)
  .delete(protect, admin, checkObjectId, deleteProduct)
  .put(protect, admin, checkObjectId, updateProduct);

export default router;
