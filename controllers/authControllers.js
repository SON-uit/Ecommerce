const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const AppError = require("../utils/appError");

const signToken = (id) =>
  jwt.sign({ id: id }, process.env.JWT_TOKEN_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
const createSendToken = (res, user, statusCode) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    status: "success",
    token,
  });
};
module.exports.signUp = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });
  createSendToken(res, user, 201);
});
module.exports.logIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      status: "Please enter your email and password",
    });
  }

  const user = await User.findOne({ email: email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return res.status(400).json({
      status: "Email or Password incorect",
    });
  }
  createSendToken(res, user, 200);
});
module.exports.logout = (req, res) => {
  res.cookie("jwt", "logout", {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: "success",
  });
};
