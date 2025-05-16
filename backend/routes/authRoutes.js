const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const verifyToken = require("../middleware/verifyToken");
const uploadProfile = require("../middleware/uploadProfile");

router.post("/login", authController.login);
router.post("/signup",uploadProfile.single('profilePic'), authController.signup);
router.post("/validate-token", authController.validateToken);
router.get("/current-user",  verifyToken, authController.currentUserController);
router.get("/users",  verifyToken, authController.getAllUsers);// to get all the users in this system
router.delete('/user/delete/:email', verifyToken, authController.deleteUser)
router.put("/user/update", verifyToken, authController.updateProfile);
router.delete("/user/profile/delete/:filename", verifyToken, authController.deleteProfilePic)

module.exports = router;
