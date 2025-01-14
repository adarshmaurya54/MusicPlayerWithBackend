const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // Import User model
const bcrypt = require("bcrypt");
require("dotenv").config();

// Login Controller
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // JWT token is already generated here in your backend controller
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return res.status(200).json({ message: "Login successful", token });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

// Token validation function
exports.validateToken = (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Get token from headers

  if (!token) {
    return res.status(403).json({ message: 'Please login!' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token

    req.user = decoded; // Attach decoded token data to the request object
    res.status(200).json({ message: 'Token is valid', user: req.user });
  } catch (err) {
    console.error(err);
    res.status(403).json({ message: 'Invalid or expired token' }); // Token verification failed
  }
};

