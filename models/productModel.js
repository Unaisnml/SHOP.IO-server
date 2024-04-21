import mongoose, { trusted } from "mongoose";

//Review Schema
const reviewSchema = mongoose.Schema({
  user:{
    type:mongoose.Schema.ObjectId,
    required:true
  },
  name: {
    type:String,
    required:true
  },
  ratings:{
    type:Number,
    required:true
  },
  comment: {
    type:String,
    required:true
  }
}, {timestamps : true})


//Product Schema
const productSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId,
        required:true,
        ref:"User"
    },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    default:0
  },
  description: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  reviews: [reviewSchema],
  numReviews: {
    type: String,
    required: true,
    default: 0,
  },
  ratings: {
    type: Number,
    required: true,
    default: 0,
  },
  stockQuantity:{
    type:Number,
    required:true,
    default:0,
  }
},
{timestamps:true});

const Product = mongoose.model("Product", productSchema)

export {Product}