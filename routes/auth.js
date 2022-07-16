const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Model = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/signup", (req, res) => {
  const { name, email, password, cpassword } = req.body;
  if (!name || !email || !password || !cpassword) {
    return res.status(400).json({ Error: "All fields are required" });
  } else if (!/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(email)) {
    return res.status(400).json({ Error: "Enter a valid email id" });
  } else if (password !== cpassword) {
    return res
      .status(400)
      .json({ Error: "Password and Confirm Password must be same" });
  }
  Model.findOne({ email }).then((found) => {
    if (found) {
      return res.status(409).json({ Error: "Email already exists" });
    }
    bcrypt.hash(password, 10).then((hashedPw) => {
      const newUser = new Model({
        name,
        email,
        password: hashedPw,
        cpassword,
      });
      newUser
        .save()
        .then(() => {
          res.status(201).json({ Message: "Succesfully registered" });
          console.log("success");
        })
        .catch((e) => {
          res.status(500).json({ Error: e });
          console.log(e);
        });
    });
  });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ Error: "All fields required" });
  } else if (!/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(email)) {
    return res.status(400).json({ Error: "Enter a valid email id" });
  }
  Model.findOne({ email }).then((userEmail) => {
    if (!userEmail) {
      return res.status(400).json({ Error: "Kindly register to login" });
    }
    bcrypt
      .compare(password, userEmail.password)
      .then((doMatch) => {
        if (!doMatch) {
          return res.status(400).json({ Error: "Invalid credentials" });
        }
        const jwtToken = jwt.sign({ _id: userEmail._id }, process.env.JWT_KEY);
        res
          .status(200)
          .json({ jwtToken, Message: `Welcome ${userEmail.name}` });
      })
      .catch((e) => {
        console.log(e);
        res.status(500).json({ Error: e });
      });
  });
});

module.exports = router;
