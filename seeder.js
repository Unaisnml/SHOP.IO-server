import mongoose from "mongoose";
import dotenv from "dotenv/config";
import colors from "colors";
import {connectDb} from "./config/dbConnection.js";
import {Product} from "./models/productModel.js";
import {Order} from "./models/orderModel.js";
import {User} from "./models/userModel.js";
import {users} from "./data/user.js";
import {products} from "./data/Products.js";


connectDb();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
console.log("Hii");
    const createUser = await User.insertMany(users);
    const adminUser = createUser[0]._id;
    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    await Product.insertMany(sampleProducts);
    console.log("Data inported".green.inverse);
    process.exit();
  } catch (error) {
    console.log(`$error`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
  } catch (error) {
    console.log(`$error`.red.inverse);
    process.exit(1);
  }
};



if(process.argv[2] === '-d'){
    destroyData()
}else{
    importData()
}
