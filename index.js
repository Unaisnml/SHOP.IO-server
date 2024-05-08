import express from "express";
import dotenv from "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { connectDb } from "./config/dbConnection.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

//Invoke Database connection
connectDb();

const app = express();

//Body parser middlware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//Cookie parser middlware
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// app.use((req, res, next) => {
//   console.log("Request cookies:", req.cookies);
//   next();
// });

//Port
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/order", orderRoutes);

app.use(notFound);
app.use(errorHandler);
