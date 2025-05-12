require("dotenv").config();

const express = require("express");
const { MongoClient } = require("mongodb"); // MongoDB native driver
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");

const authRoutes = require("./routes/auth.routes");
const postRoutes = require("./routes/post.routes");

const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection using native driver
let db;

MongoClient.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then((client) => {
    db = client.db(); // Set the database connection for later use
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes(db));  // Passing db object to routes
app.use("/api/posts", postRoutes(db));  // Passing db object to routes

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
