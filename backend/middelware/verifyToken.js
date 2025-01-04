const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Access denied, token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Store the decoded user info in the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(400).json({ error: "Invalid token" });
  }
};

module.exports = verifyToken;
