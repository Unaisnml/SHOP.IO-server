import mongoose from 'mongoose'
import asyncHandler from 'express-async-handler'
const url = process.env.MONGO_URL


const connectDb = asyncHandler(async() =>{
    const conn = await mongoose.connect(url)
    console.log(`Server is connnected to ${conn.connection.host}`);
})

export {connectDb}


