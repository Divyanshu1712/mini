const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

module.exports = (db) => {
  // Register route
  router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    const usersCollection = db.collection("users");

    try {
      const user = await usersCollection.findOne({ email });
      if (user) return res.status(400).json({ message: "User already exists" });

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      await usersCollection.insertOne({
        name,
        email,
        password: hashedPassword,
      });

      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // Login route
  router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const usersCollection = db.collection("users");

    try {
      const user = await usersCollection.findOne({ email });
      if (!user) return res.status(400).json({ message: "Invalid email or password" });

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

      // Create JWT token
      const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.status(200).json({ message: "Login successful" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  return router;
};