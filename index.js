import express from "express";
import dotenv from "dotenv/config";
import mongoose from "mongoose";
import cors from "cors";
import productRoute from "./routes/productRoute.js";
import { connectDb } from "./config/dbConnection.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

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

app.use('/api/products' ,productRoute)



app.use(notFound)
app.use(errorHandler)




