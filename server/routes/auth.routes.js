// routes/auth.routes.js

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authMiddleware = require('../middlewares/authMiddleware'); // Correct import path

const router = express.Router();

module.exports = (db) => {
  // Example of a protected route using authMiddleware
  router.get('/protected', authMiddleware, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
  });

  // Your other routes like register and login here...
  // Example of the register route
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

  return router;
};
