import { asyncHandler } from "../middleware/asyncHandler.js";
import { Product } from "../models/productModel.js";

// @desc Get all products
// @route GET api/products
// @access public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
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
// @access Private/Admin
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
// @access Private/Admin

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
// @access Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, image, category, brand, stockQuantity, description } =
    req.body;
  const { id } = req.params;
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

//@desc Create review of product
//@route POST api/products/:id/reviews
//@access Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  console.log("comment body", req.body);

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };
    product.reviews.push(review);

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(200).json({ message: "Review Added" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

//@desc Find top rated products
//@route GET api/products/top
//@access Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(2);
  res.json(products);
});

//@desc Search products
//@route GET api/products/search
//@access Public
const searchProducts = asyncHandler(async (req, res) => {
  const { query } = req.query;
  console.log("query", req.query);
  if (!query) {
    return res.json([]);
  }

  try {
    const products = await Product.find({
      name: new RegExp(query, "i"),
    }).limit(10);

    res.json(products);
  } catch (error) {
    console.error(error);
  }
});

// @desc    Fetch all products with filters
// @route   GET /api/products/filter
// @access  Public
const getFilteredProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(process.env.PAGINATION_LIMIT);

  const { keyword, category, brand, rating } = req.query;

  const page = Number(req.query.page) || 1;

  let aggregationPipeline = [];

  if (keyword) {
    const searchTerms = keyword.split(" ");
    const regexPatterns = searchTerms.map((term) => new RegExp(term, "i"));
    aggregationPipeline.push({
      $match: { name: { $in: regexPatterns } },
    });
  }

  if (category) {
    aggregationPipeline.push({
      $match: { category },
    });
  }

  if (brand) {
    aggregationPipeline.push({
      $match: { brand },
    });
  }

  if (rating) {
    aggregationPipeline.push({
      $match: { rating: { $gte: Number(rating) } },
    });
  }

  aggregationPipeline.push({
    $count: "total",
  });

  const countResult = await Product.aggregate(aggregationPipeline);

  const count = countResult.length > 0 ? countResult[0].total : 0;

  const pages = Math.ceil(count / pageSize);

  aggregationPipeline.pop();

  aggregationPipeline.push({
    $skip: (page - 1) * pageSize,
  });

  aggregationPipeline.push({
    $limit: pageSize,
  });

  const products = await Product.aggregate(aggregationPipeline);

  const categories = await Product.distinct("category");

  const brands = await Product.distinct("brand");

  res.json({ products, page, pages, categories, brands, count });
});

export {
  getProducts,
  getProductById,
  createProduct,
  deleteProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
  searchProducts,
  getFilteredProducts,
};
