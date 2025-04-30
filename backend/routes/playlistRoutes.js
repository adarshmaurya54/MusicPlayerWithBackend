const express = require("express");
const router = express.Router();

const playlistController = require("../controllers/playlistController");
const verifyToken = require("../middleware/verifyToken");

router.post("/create", verifyToken, playlistController.createPlaylist);
router.put("/edit", verifyToken, playlistController.editPlaylist);
router.delete("/delete/:id", verifyToken, playlistController.deletePlaylist);
router.post("/addSongs", verifyToken, playlistController.addSongs);
router.get("/", verifyToken, playlistController.getUserPlaylists);
router.get("/:playlistId", verifyToken, playlistController.getUserPlaylistByPlaylistId);
router.get("/publicPlaylist/:playlistId", playlistController.getUserPublicPlaylistByPlaylistId);
router.put("/:playlistId/delete-song", verifyToken, playlistController.deletePlaylistSong);
router.put("/:playlistId/updateVisibility", verifyToken, playlistController.updatePlaylistVisibility);

module.exports = router;    