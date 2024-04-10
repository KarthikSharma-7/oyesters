const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Model = require("../models/userModel");
require("dotenv").config();

exports.checkFunction = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(400).json({ Error: "Login required..." });
  }
  const jwtToken = authorization.replace("Bearer ", "");
  jwt.verify(jwtToken, process.env.JWT_KEY, (err, payload) => {
    if (err) {
      return res.status(400).json({ Error: err });
    }
    const { _id } = payload;
    Model.findOne({ _id }).then((userInfo) => {
      userInfo.password = undefined;
      userInfo.cpassword = undefined;
      req.user = userInfo;
      next();
    });
  });
};
