const jwt = require("jsonwebtoken");

exports.isLoggedIn = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token error:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
};
