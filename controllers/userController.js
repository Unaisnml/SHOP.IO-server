import { asyncHandler } from "../middleware/asyncHandler.js";
import { User } from "../models/userModel.js";
import { validateEmail } from "../utils/validation.js";
import { validateLength } from "../utils/validation.js";
import { generateToken } from "../utils/generateToken.js";
import { sendOtp } from "../utils/generateOtp.js";

//@desc Auth User & Get token
//@route POST/api/users/login
//@access public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email });
  console.log(user);

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
    throw new Error("Account already exists, please login");
  }

  if (!validateLength(password, 6, 20)) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }

  try {
    const otpResponse = await sendOtp(email);
    const otp = otpResponse.otp;
    const otpExpires = Date.now() + 5 * 60 * 1000;

    const user = await User.create({
      name,
      email,
      password,
      otp,
      otpExpires,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    console.error("Failed to send OTP:", error);
    res.status(500).json({ message: "Failed to send OTP", error: error.message });
  }
});

//@desc Verify Otp user
//@route POST/api/verifyOtp
//@access public

const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  console.log('otp',req.body);

  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }

  if (user.otp !== otp) {
    res.status(400);
    throw new Error("Invalid OTP");
  }

  if (user.otpExpires < Date.now()) {
    res.status(400);
    throw new Error("OTP has expired");
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  generateToken(res, user._id);
  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
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
  const users = await User.find({});
  if (users) {
    res.status(200).json(users);
  } else {
    throw new Error("No User Found");
  }
});

//@desc Get user by ID
//@route GET/api/users/:id
//@access private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  console.log("Hellllllllllllllllllo", user);
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
});

//@desc Delete users
//@route DELETE/api/users/:id
//@access private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  console.log("lllllllllllllllllllllllllllllllllllll");
  const user = await User.findById(req.params.id);
  console.log(user);
  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("Cannot delete admin user");
    } else {
      console.log("inside controlller");
      await User.deleteOne({ _id: user._id });
      res.status(200).json({ message: "User deleted successfully" });
    }
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
});

//@desc Update user
//@route PUT/api/users/:id
//@access private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  console.log(user);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
});

export {
  authUser,
  registerUser,
  verifyOtp,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
};
