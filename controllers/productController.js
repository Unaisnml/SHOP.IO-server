import { asyncHandler } from "../middleware/asyncHandler.js";
import { Product } from "../models/productModel.js";

// @desc Get all products
// @route GET api/products
// @access public
const getProducts = asyncHandler(async(req, res) =>{
    const products = await Product.find({});
    res.json(products);
})

//get single product by Id
const getProductById = asyncHandler(async(req, res)=>{
    const id = req.params.id;
    const product = await Product.findById(id)
    if(product){
        res.json(product)
    }else{
        res.status(404);
        throw new Error("Resource not found");
    }
})

export {getProducts, getProductById}