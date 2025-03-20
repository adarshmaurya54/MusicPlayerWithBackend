const express = require("express");
const router = express.Router();

const playlistController = require("../controllers/playlistController");
const verifyToken = require("../middleware/verifyToken");

router.post("/create", verifyToken, playlistController.createPlaylist);
router.post("/addSongs", verifyToken, playlistController.addSongs);
router.get("/", verifyToken, playlistController.getUserPlaylists);
router.get("/:playlistId", verifyToken, playlistController.getUserPlaylistByPlaylistId);

module.exports = router;