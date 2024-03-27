import express from "express";
import dotenv from "dotenv/config";
import mongoose from "mongoose";
import cors from "cors";
import products from "./data/Products.js";
import { connectDb } from "./config/dbConnection.js";

//Database connection
connectDb();

const app = express();

app.use(express.json());
app.use(cors());

//Port
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

app.get("/api/products", (req, res) => {
  console.log("request from front");
  res.json(products);
});

app.get("/api/products/:id", (req, res) => {
  const product = products.find((p) => p._id === req.params.id);
  console.log("request for single product");
  res.json(product);
});
