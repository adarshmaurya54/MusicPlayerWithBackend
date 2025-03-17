const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const verifyToken = require("../middleware/verifyToken");

router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.post("/validate-token", authController.validateToken);
router.get("/current-user",  verifyToken, authController.currentUserController);

module.exports = router;
