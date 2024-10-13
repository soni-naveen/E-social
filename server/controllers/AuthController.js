const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// User Registration
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email or username already exists!",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).json({
      success: "true",
      message: "User registered successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Registration ERROR!",
    });
  }
};

// User Login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res.status(400).json({
        success: false,
        message: "User not found!",
      });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({
        success: false,
        message: "Wrong password!",
      });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({
      success: true,
      token,
      message: "Login successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login ERROR!",
    });
  }
};

exports.getUserDetails = async (req, res) => {
  const id = req.user.id;
  const user = await User.findById(id).populate("friends");

  return res.status(200).json({
    user,
    success: true,
    message: "User details fetched!",
  });
};

exports.allUsers = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const currentUser = await User.findById(currentUserId);

    const users = await User.find({
      $and: [
        { _id: { $ne: currentUserId } },
        { _id: { $nin: currentUser.friends } },
        { _id: { $nin: currentUser.requested } },
      ],
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
