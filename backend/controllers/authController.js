const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // Import User model
const bcrypt = require("bcrypt");
require("dotenv").config();

// Login Controller
exports.login = async (req, res) => {
  const { email, password, loginType } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role !== loginType) {
      return res.status(403).json({ error: "Access denied. Admin only!" });
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

exports.signup = async (req, res) => {
  try {
      const { name, email, password, profile } = req.body;

      // ✅ Check if all fields are provided
      if (!name || !email || !password) {
          return res.status(400).json({ error: "All fields are required!" });
      }

      // ✅ Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ error: "Email already registered!" });
      }

      // ✅ Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // ✅ Create new user
      const newUser = new User({
          name,
          email,
          password: hashedPassword,
          profile: profile || "", // Default empty if no profile is provided
      });

      // ✅ Save user to database
      await newUser.save();

      // ✅ Send response
      res.status(201).json({
          message: "User registered successfully!",
          user: {
              id: newUser._id,
              name: newUser.name,
              email: newUser.email,
              profile: newUser.profile,
          },
      });
  } catch (error) {
      console.error("Signup Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
};
