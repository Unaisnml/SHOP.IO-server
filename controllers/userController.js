import { asyncHandler } from "../middleware/asyncHandler.js";
import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";

//@desc Auth User & Get token
//@route POST/api/users/login
//@access public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email });

  if (!user) {
    res.status(401);
    throw Error("Invalid Email address");
  }
  const check = await user.checkPassword(password);
  console.log(process.env.JWT_SECRET);
  if (check) {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    // Set jwt as HTTP only cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: "strict", // Prevent CSRF attacks
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error("Invalid Password");
  }
});

//@desc Register user
//@route POST/api/users
//@access public
const registerUser = asyncHandler(async (req, res) => {
  res.send("register user");
});

//@desc Logut user / clear cookie
//@route POST/api/users/logout
//@access private
const logoutUser = asyncHandler(async (req, res) => {
  res.send("logout user");
});

//@desc Get user Profile
//@route GET/api/users/profile
//@access private
const getUserProfile = asyncHandler(async (req, res) => {
  res.send("User profile");
});

//@desc Update user Profile
//@route PUT/api/users/profile
//@access private
const updateUserProfile = asyncHandler(async (req, res) => {
  res.send("update profile");
});

//@desc Get users
//@route GET/api/users
//@access private/Admin
const getUsers = asyncHandler(async (req, res) => {
  res.send("Get Users");
});

//@desc Get user by ID
//@route GET/api/users/:id
//@access private/Admin
const getUserById = asyncHandler(async (req, res) => {
  res.send("Get User by id");
});

//@desc Delete users
//@route DELETE/api/users/:id
//@access private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  res.send("delete User");
});

//@desc Update user
//@route PUT/api/users/:id
//@access private/Admin
const updateUser = asyncHandler(async (req, res) => {
  res.send("Update User by id");
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
};
