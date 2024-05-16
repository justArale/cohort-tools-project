// routes/auth.routes.js

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

const router = express.Router();
const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const saltRounds = 10;

// POST  /auth/signup
router.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    res.status(401).json({ message: "All inputs are required!" });
    return;
  }
  try {
    const foundUser = await User.findOne({ email: email });
    if (foundUser) {
      res.status(401).json({ message: "User already exists!" });
      return;
    }
    // If the email is unique, proceed to hash the password
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const createdUser = await User.create({
      email,
      password: hashedPassword,
      name,
    });
    res.json(createdUser);
  } catch (error) {
    res.status(500).json({ message: "Internel server error!" });
  }
});

// POST  /auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(401).json({ message: "All inputs are required!" });
    return;
  }
  try {
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      res
        .status(401)
        .json({ message: "Email does not exist. Please register first!" });
      return;
    }
    const passwortMatch = await bcrypt.compare(password, foundUser.password);
    if (!passwortMatch) {
      res.status(401).json({ message: "Wrong email or password!" });
      return;
    }

    // Create an object that will be set as the token payload
    const payload = {
      _id: foundUser._id,
      email: foundUser.email,
      name: foundUser.name,
    };

    // Create and sign the token
    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "6h",
    });
    res.status(200).json({ authToken });
  } catch (error) {
    res.status(500).json({ message: "Internel server error!" });
  }
});

// GET  /auth/verify  -  Used to verify JWT stored on the client
router.get("/verify", isAuthenticated, (req, res, next) => {
  // <== CREATE NEW ROUTE

  // If JWT token is valid the payload gets decoded by the
  // isAuthenticated middleware and made available on `req.payload`
  console.log(`req.payload`, req.payload);

  // Send back the object with user data
  // previously set as the token payload
  res.status(200).json(req.payload);
});

module.exports = router;
