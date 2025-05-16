const Song = require("../models/songModel");
const Artist = require("../models/artistModel");
const path = require("path");
const fs = require("fs");
const musicMetadata = require("music-metadata");
const mongoose = require("mongoose");
const sharp = require("sharp");
const {
  uploadFileToDrive,
  authorize,
} = require("../services/googleDriveService");
const { google } = require("googleapis");

// Get a specific song by songId
exports.getSongById = async (req, res) => {
  const { songId } = req.params; // Extract songId from the request URL

  try {
    // Find the song in the database by songId
    const song = await Song.findOne({ songId });

    // If the song doesn't exist, return a 404 response
    if (!song) {
      return res.status(404).json({ error: "Song not found" });
    }

    // Respond with the song data
    res.status(200).json({ message: "Song fetched successfully", song });
  } catch (error) {
    console.error("Error fetching song:", error);

    // Respond with a server error
    res.status(500).json({ error: "Server error while fetching song" });
  }
};
// delete song by songid
exports.deleteSongById = async (req, res) => {
  try {
    const { songId } = req.params; // Get songId from URL parameters

    // Fetch the song record from the database
    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    const fileId = song.audioFile; // The fileId of the song stored in Google Drive

    // Authorize with Google Drive
    const authClient = await authorize();
    const drive = google.drive({ version: "v3", auth: authClient });

    // Delete the file from Google Drive
    try {
      await drive.files.delete({ fileId }); // Google Drive API delete call
      console.log("File deleted from Google Drive");

      // Now delete the song record from the database
      await Song.findByIdAndDelete(songId);
      res.status(200).json({
        message:
          "Song deleted successfully from both database and Google Drive",
      });
    } catch (driveError) {
      console.error("Error deleting file from Google Drive:", driveError);
      return res
        .status(500)
        .json({ message: "Error deleting file from Google Drive" });
    }
  } catch (error) {
    console.error("Error deleting song:", error);
    res.status(500).json({ message: "Server error while deleting song" });
  }
};
// Controller to update song details
exports.updateSongById = async (req, res) => {
  const { songId } = req.params; // Extract songId from URL parameters
  const { songName, artistName, lyrics } = req.body; // Extract fields to update from the request body

  try {
    // Find the song by songId and update the fields
    const updatedSong = await Song.findOneAndUpdate(
      { songId }, // Find song by songId
      {
        $set: {
          songName, // Update song name
          artistName, // Updatgge artist name
          lyrics, // Update lyrics
        },
      },
      { new: true } // Return the updated song
    );

    // If song not found
    if (!updatedSong) {
      return res.status(404).json({ message: "Song not found" });
    }

    // Send the updated song details in the response
    res.json(updatedSong);
  } catch (error) {
    console.error("Error updating song:", error);
    res.status(500).json({ message: "Failed to update song" });
  }
};

exports.createSong = async (req, res) => {
  const { songName, lyrics } = req.body;
  const audioFile = req.file; // The uploaded file from the request

  if (!audioFile) {
    return res.status(400).json({ message: "Audio file is required" });
  }

  try {
    // Read metadata from the audio file
    const metadata = await musicMetadata.parseBuffer(audioFile.buffer);

    // Extract metadata fields
    const extractedSongName = metadata.common.title || songName; // Use metadata title if available, fallback to songName
    const extractedArtistName = metadata.common.artist || "Unknown Artist"; // Use metadata artist, fallback to 'Unknown Artist'
    const extractedLyrics = lyrics && lyrics.trim() !== "" ? lyrics : "Lyrics not available"; 

    // Generate the songId
    const songId = extractedSongName.replace(/\s+/g, ""); // Remove spaces for songId

    // Check if the songId already exists in the database
    const existingSong = await Song.findOne({ songId });

    if (existingSong) {
      return res.status(409).json({
        message: "Song already exists in the database",
        flag: "SONG_EXISTS",
      });
    }

    // Authorize with Google Drive
    await authorize();

    // Upload the audio file to Google Drive
    const fileName = `${extractedSongName}.mp3`; // Save file as songName.mp3
    const googleDriveFileData = await uploadFileToDrive(
      audioFile.buffer,
      fileName
    );

    // Save song data to MongoDB
    const newSong = new Song({
      songId,
      songName: extractedSongName,
      artistName: extractedArtistName,
      lyrics: extractedLyrics,
      audioFile: googleDriveFileData.id, // Save the Google Drive file ID
    });

    await newSong.save();

    // Handle artist(s)
    const artistNames = extractedArtistName
      .split(",")
      .map((name) => name.trim()); // Handle multiple artists
    for (const name of artistNames) {
      const existingArtist = await Artist.findOne({ name });

      if (!existingArtist) {
        // If artist doesn't exist, create a new entry
        const newArtist = new Artist({ name });
        await newArtist.save();
      }
    }

    res.status(201).json({
      message: "Song created, uploaded to Google Drive, and artists saved",
      newSong,
    });
  } catch (error) {
    console.error("Error creating song:", error);
    res.status(500).json({
      message: "Error creating song and uploading to Google Drive",
      error: error.message,
    });
  }
};

exports.getAllSongs = async (req, res) => {
  try {
    const { favourite, artist } = req.query; // Get 'favourite' and 'artist' flags from the query parameters

    let filter = {}; // Default filter to get all songs

    // If 'favourite' flag is provided and is true, filter songs with favourite set to true
    if (favourite === "true") {
      filter.favourite = true;
    }

    // If 'artist' is provided, check if the artist name contains 'Udit Narayan'
    if (artist !== "all") {
      // Use regex to match 'Udit Narayan' in the artistName field
      filter.artistName = { $regex: artist, $options: "i" }; // 'i' for case-insensitive match
    }

    const totalSongs = await Song.countDocuments(filter); // Get total count of filtered songs

    const songs = await Song.aggregate([
      { $match: filter },
      { $sample: { size: totalSongs } }, // Shuffle all songs
    ]);

    if (songs.length === 0) {
      return res.status(200).json([]); // Return an empty array if no songs found
    }

    res.status(200).json(songs); // Return songs if found
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve songs" });
  }
};

exports.getSongWithMetadata = async (req, res) => {
  const fileId = req.params.fileId; // Google Drive file ID
  const thumbnailFolder = path.join(__dirname, "..", "assets", "thumbnails"); // Path for thumbnail storage

  // Ensure the thumbnails folder exists
  if (!fs.existsSync(thumbnailFolder)) {
    console.log("Creating thumbnail folder...");
    fs.mkdirSync(thumbnailFolder, { recursive: true });
  }

  try {
    // Authorize and get Google Drive service
    const authClient = await authorize();
    const drive = google.drive({ version: "v3", auth: authClient });

    // Get file metadata from Google Drive
    const fileMetadata = await drive.files.get({
      fileId,
      fields: "name, mimeType, size",
    });
    const fileName = fileMetadata.data.name;
    const mimeType = fileMetadata.data.mimeType;

    if (!fileName || mimeType !== "audio/mpeg") {
      return res
        .status(404)
        .json({ error: "Audio file not found or invalid format" });
    }

    // Extract song and artist details from metadata (using Google Drive API)
    const audioFile = await drive.files.get(
      { fileId, alt: "media" },
      { responseType: "stream" }
    );

    const audioBuffer = [];
    audioFile.data.on("data", (chunk) => audioBuffer.push(chunk));
    audioFile.data.on("end", async () => {
      const buffer = Buffer.concat(audioBuffer);

      try {
        // Extract metadata using music-metadata
        const metadata = await musicMetadata.parseBuffer(buffer);

        // Extract song and artist details with fallbacks
        const songName = metadata.common.title || fileName;
        const artistName = metadata.common.artist || "Unknown Artist";

        // Extract thumbnail data if available
        const imageData = metadata.common.picture
          ? metadata.common.picture[0]
          : null;
        let highQualityThumbnailUrl = null;
        let lowQualityThumbnailUrl = null;

        if (imageData) {
          const imageBuffer = Buffer.from(imageData.data);

          // Define file paths for high and low-quality thumbnails
          const highQualityThumbnailPath = path.join(
            thumbnailFolder,
            `${fileId}-high.jpg`
          );
          const lowQualityThumbnailPath = path.join(
            thumbnailFolder,
            `${fileId}-low.jpg`
          );

          console.log("Generating high-quality thumbnail...");
          await sharp(imageBuffer)
            .resize({ width: 600, height: 600, fit: "cover" }) // High-quality size (e.g., 600x600)
            .toFormat("jpg")
            .jpeg({ quality: 100, chromaSubsampling: "4:4:4" }) // High compression quality
            .toFile(highQualityThumbnailPath);
          highQualityThumbnailUrl = `/thumbnails/${fileId}-high.jpg`;

          console.log("Generating low-quality thumbnail...");
          await sharp(imageBuffer)
            .resize({ width: 100, height: 100, fit: "cover" }) // Low-quality size (e.g., 100x100)
            .toFormat("jpg")
            .jpeg({ quality: 50 }) // Low compression quality
            .toFile(lowQualityThumbnailPath);
          lowQualityThumbnailUrl = `/thumbnails/${fileId}-low.jpg`;
        } else {
          // Fallback to default thumbnails
          highQualityThumbnailUrl = "/thumbnails/default-thumbnail-low.png";
          lowQualityThumbnailUrl = "/thumbnails/default-thumbnail-low.png";
        }

        // Fetch song details from the database (optional)
        const song = await Song.findOne({ audioFile: fileId });

        if (!song) {
          return res
            .status(404)
            .json({ error: "Song not found in the database." });
        }

        // Respond with song details and thumbnail URLs
        res.json({
          _id: song._id,
          lyrics: song.lyrics,
          songName: song.songName || songName,
          audioUrl: `/stream/${fileId}`, // Stream URL for Google Drive file ID
          artistName: song.artistName || artistName,
          favourite: song.favourite || false, // Include favourite status
          highQualityThumbnailUrl,
          lowQualityThumbnailUrl,
          likes: song.likes,
        });
      } catch (error) {
        console.error("Error extracting metadata:", error);
        res
          .status(500)
          .json({ error: "Error extracting metadata from the audio file." });
      }
    });
  } catch (error) {
    console.error("Error fetching song metadata:", error);
    res
      .status(500)
      .json({ error: "Error fetching song metadata from Google Drive." });
  }
};
// Stream audio from Google Drive starting from a specific time
exports.streamAudio = async (req, res) => {
  const fileId = req.params.fileId;

  try {
    const authClient = await authorize();
    const drive = google.drive({ version: "v3", auth: authClient });

    // Get file metadata to determine file size
    const fileMetadata = await drive.files.get({
      fileId,
      fields: "size, mimeType",
    });
    const fileSize = parseInt(fileMetadata.data.size, 10);
    const mimeType = fileMetadata.data.mimeType || "audio/mpeg";

    // Set headers for full file response
    res.set({
      "Content-Type": mimeType,
      "Content-Length": fileSize,
      "Accept-Ranges": "bytes",
    });

    // Stream the entire file from Google Drive
    const fileStream = await drive.files.get(
      {
        fileId,
        alt: "media",
      },
      { responseType: "stream" }
    );

    fileStream.data.pipe(res);
  } catch (error) {
    console.error("Error details:", error.response?.data || error.message);
    res.status(error.response?.status || 500).send("Error fetching file.");
  }
};

exports.deleteThumbnails = async (req, res) => {
  const songId = req.params.songId; // Get songId from the route parameter
  console.log("songid", songId);
  const thumbnailFolder = path.join(__dirname, "..", "assets", "thumbnails"); // Path to the thumbnails folder

  // Define file paths for high and low-quality thumbnails
  const highQualityThumbnailPath = path.join(
    thumbnailFolder,
    `${songId}-high.jpg`
  );
  const lowQualityThumbnailPath = path.join(
    thumbnailFolder,
    `${songId}-low.jpg`
  );

  try {
    // Check and delete the high-quality thumbnail if it exists
    if (fs.existsSync(highQualityThumbnailPath)) {
      fs.unlinkSync(highQualityThumbnailPath);
      console.log(`Deleted: ${highQualityThumbnailPath}`);
    } else {
      console.log(
        `High-quality thumbnail not found: ${highQualityThumbnailPath}`
      );
    }

    // Check and delete the low-quality thumbnail if it exists
    if (fs.existsSync(lowQualityThumbnailPath)) {
      fs.unlinkSync(lowQualityThumbnailPath);
      console.log(`Deleted: ${lowQualityThumbnailPath}`);
    } else {
      console.log(
        `Low-quality thumbnail not found: ${lowQualityThumbnailPath}`
      );
    }

    // Respond with success
    res.json({
      message: "Thumbnails deleted successfully",
      songId,
    });
  } catch (error) {
    console.error("Error deleting thumbnails:", error);
    res.status(500).json({ error: "Error deleting thumbnails" });
  }
};

// Controller function to toggle the favourite field
exports.toggleFavourite = async (req, res) => {
  const { songId } = req.params; // Get the songId from the URL parameter
  console.log(songId);

  try {
    // Find the song by audioFile (which is equivalent to songId in your case)
    const song = await Song.findOne({ audioFile: songId });

    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    // Toggle the favourite field
    song.favourite = !song.favourite;

    // Save the updated song
    await song.save();

    res.status(200).json({
      message: `Song '${song.songName}' favourite status updated`,
      favourite: song.favourite,
    });
  } catch (error) {
    console.error("Error toggling favourite status:", error);
    res.status(500).json({ error: "Failed to toggle favourite status" });
  }
};

exports.songLike = async (req, res) => {
  try {
    let { songId } = req.params;
    let { userId } = req.body; // Assuming user is authenticated

    // Check if songId and userId exist
    if (!songId || !userId) {
      return res
        .status(400)
        .json({ message: "songId and userId are required" });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(songId)) {
      return res.status(400).json({ message: "Invalid songId format" });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId format" });
    }

    songId = new mongoose.Types.ObjectId(songId);
    userId = new mongoose.Types.ObjectId(userId);

    // Find the song by ID
    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    const index = song.likes.findIndex((id) => id.equals(userId));

    if (index === -1) {
      // User has not liked the song, so like it
      song.likes.push(userId);
      await song.save();
      return res.json({ message: "Liked the song", likes: song.likes.length });
    } else {
      // User already liked, so unlike it
      song.likes.splice(index, 1);
      await song.save();
      return res.json({
        message: "Unliked the song",
        likes: song.likes.length,
      });
    }
  } catch (error) {
    console.error("Error in songLike:", error.message);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.shareSong = async (req, res) => {
  const fileId = req.params.fileId
  try {
        // Find song in the database by fileId (optional)
        const song = await Song.findOne({ audioFile: fileId });

        // Return metadata and Open Graph preview dynamically
        res.set("Content-Type", "text/html");
        res.send(`
          <!DOCTYPE html>
        <html>
          <head>
            <meta property="og:title" content="${song.songName}" />
            <meta property="og:description" content="By ${song.artistName}" />
            <meta property="og:image" content="https://adarshmusicplayerwithbackend.vercel.app/icon.png">
            <meta property="og:url" content="https://adarshmusicplayerwithbackend.vercel.app/song/${fileId}" />
            <meta property="og:type" content="music.song" />
            <meta http-equiv="refresh" content="0;url=https://adarshmusicplayerwithbackend.vercel.app/song/${fileId}" />
            <title>${song.songName}</title>
          </head>
          <body>
            Please wait...
            <script>
              window.location.href = "https://adarshmusicplayerwithbackend.vercel.app/song/${fileId}";
            </script>
          </body>
        </html>
        `);
      } catch (error) {
        console.error("Error extracting metadata:", error);
        return res.status(500).json({ error: "Failed to extract song metadata" });
      }
};

exports.getLikedSongs = async (req, res) => {
  try{
    const userId = new mongoose.Types.ObjectId(req.body.userId);
    
    
    const likedSongs = await Song.find({likes: userId})

    if(likedSongs.length === 0){
      return res.status(404).json({message: 'No liked songs found for this user.'})
    }

    return res.status(200).json(likedSongs)
  } catch (error) {
    return res.status(500).json({ error: 'An error occurred while fetching liked songs.' });
  }
}
