import { asyncHandler } from "../middleware/asyncHandler.js";
import { User } from "../models/userModel.js";
import { validateEmail } from "../utils/validation.js";
import { validateLength } from "../utils/validation.js";
import { generateToken } from "../utils/generateToken.js";

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

  if (check) {
    generateToken(res, user._id);
    
    res.json({
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
  const { name, email, password } = req.body;

  if (!validateEmail(email)) {
    res.status(400);
    throw new Error("Invalid email address");
  }
  const emailExist = await User.findOne({ email });
  if (emailExist) {
    res.status(400);
    throw new Error("Account already Exist, Please login");
  }

  if (!validateLength(password, 6, 20)) {
    res.status(400);
    throw new Error("Password must atleast 6 Characters");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id);
    
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

//@desc Logout user / clear cookie
//@route POST/api/users/logout
//@access private
const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ message: "Logged out successfully" });
});

//@desc Get user Profile
//@route GET/api/users/profile
//@access private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    console.log(user.name);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not Found");
  }
});

//@desc Update user Profile
//@route PUT/api/users/profile
//@access private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.name;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    console.log(updatedUser);

    res.status(200).json({
      _id: updateUser._id,
      name: updateUser.name,
      email: updateUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
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
