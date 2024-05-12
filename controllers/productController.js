import { asyncHandler } from "../middleware/asyncHandler.js";
import { Product } from "../models/productModel.js";

// @desc Get all products
// @route GET api/products
// @access public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

//get single product by Id
const getProductById = asyncHandler(async (req, res) => {
  console.log("this is from single product");
  const id = req.params.id;
  const product = await Product.findById(id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
});

// @desc Create new Product
// @route POST api/products
// @access private/admin
const createProduct = asyncHandler(async (req, res) => {
  try {
    const product = await new Product({
      name: "Sample name",
      price: "0",
      user: req.user._id,
      image: "/Sample.jpg",
      category: "Sample",
      brand: "Sample",
      stockQuantity: "0",
      numReviews: "0",
      ratings: "8",
      description: "Sample",
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
  }
});

// @desc Delete a Product
// @route DELETE api/products
// @access private/admin

const deleteProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const product = await Product.findById(id);
  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.status(201).json({ message: "Product Removed" });
  } else {
    res.status(404);
    throw new Error("Producut not found");
  }
});

// @desc Update a product
// @route PUT api/products/:id
// @access private/admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, image, category, brand, stockQuantity, description } =
    req.body;
  const id = req.params.id;
  const product = await Product.findById(id);
  if (product) {
    product.name = name;
    product.price = price;
    product.image = image;
    product.category = category;
    product.brand = brand;
    product.description = description;
    product.stockQuantity = stockQuantity;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
});

export {
  getProducts,
  getProductById,
  createProduct,
  deleteProduct,
  updateProduct,
};
