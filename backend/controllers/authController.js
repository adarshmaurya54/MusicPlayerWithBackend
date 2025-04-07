const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // Import User model
const bcrypt = require("bcrypt");
const uploadProfile = require("../middleware/uploadProfile");
const { default: mongoose } = require("mongoose");
const fs = require("fs")
const path = require("path");
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
    return res
      .status(200)
      .json({ success: true, message: "Login successfully...", token, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

// Token validation function
exports.validateToken = (req, res) => {
  const token = req.header("Authorization")?.replace("Bearer ", ""); // Get token from headers

  if (!token) {
    return res.status(403).json({ message: "Please login!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token

    req.user = decoded; // Attach decoded token data to the request object
    res.status(200).json({ message: "Token is valid", user: req.user });
  } catch (err) {
    console.error(err);
    res.status(403).json({ message: "Invalid or expired token" }); // Token verification failed
  }
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const profilePic = req.file?.filename; // get filename from multer

    console.log(name);
    console.log(email);
    console.log(password);
    console.log("Uploaded profile pic filename:", profilePic);

    // Check if all fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered!" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      profilePic: profilePic || "default-user.svg", // default to empty if no file uploaded
    });

    // Save user to database
    await newUser.save();

    // Send response
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


exports.currentUserController = async (req, res) => {
  try {
      const user = await User.findOne({_id: req.body.userId});
      return res.status(200).send({
          success: true,
          message: 'User fetched successfully...',
          user
      })
  } catch (error) {
      console.log(error);
      return res.status(500).send({
          success: false,
          message: 'unable to get current user',
          error
      })
  }
}

exports.updateProfile = async (req, res) => {
  const userId_ = req.body.userId
  try {
    // Use multer inside the controller
    uploadProfile.single("profilePic")(req, res, async function (err) {
      if (err) {
        return res.status(400).json({ error: "Image upload failed" });
      }
      
      
      const { name } = req.body;
      const userId = new mongoose.Types.ObjectId(req.body.userId ? req.body.userId : userId_); // Convert to ObjectId

      const updateData = { name };

      if (req.file) {
        updateData.profilePic = req.file.filename;
      }

      const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Server error while updating profile" });
  }
};

exports.deleteProfilePic = async (req, res) => {
  try {
    const filename = req.params.filename
    if (!filename) {
      return res.status(400).json({ error: 'Filename is required' });
    }

    const filePath = path.join(__dirname, '../assets/users', filename);

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('File deletion failed:', err.message);
        return res.status(500).json({ error: 'Failed to delete file' });
      }

      return res.status(200).json({success: true, message: "profile deleted successfully", filename})
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Server error while deleting profile" });
  }
}