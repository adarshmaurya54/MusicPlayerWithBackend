const express = require("express");
const router = express.Router();

const playlistController = require("../controllers/playlistController");
const verifyToken = require("../middleware/verifyToken");

router.post("/create", verifyToken, playlistController.createPlaylist);
router.get("/", verifyToken, playlistController.getUserPlaylist);
module.exports = router;