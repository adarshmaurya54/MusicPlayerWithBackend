const Song = require("../models/songModel");
const path = require("path");
const fs = require("fs");
const musicMetadata = require("music-metadata");
const sharp = require("sharp"); // For resizing image
const { default: mongoose } = require("mongoose");
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

    const fileId = song.audioFile;  // The fileId of the song stored in Google Drive

    // Authorize with Google Drive
    const authClient = await authorize();
    const drive = google.drive({ version: "v3", auth: authClient });

    // Delete the file from Google Drive
    try {
      await drive.files.delete({ fileId });  // Google Drive API delete call
      console.log("File deleted from Google Drive");

      // Now delete the song record from the database
      await Song.findByIdAndDelete(songId);
      res.status(200).json({ message: "Song deleted successfully from both database and Google Drive" });
    } catch (driveError) {
      console.error("Error deleting file from Google Drive:", driveError);
      return res.status(500).json({ message: "Error deleting file from Google Drive" });
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
          artistName, // Update artist name
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

    // Extract song name from metadata (prefer metadata if available)
    const extractedSongName = metadata.common.title || songName; // If title is not found, use songName from req.body
    const extractedArtistName = metadata.common.artist || "Unknown Artist"; // Default to 'Unknown Artist' if no artist is found

    // Construct the file name and MIME type based on metadata
    const fileName = `${extractedSongName}.mp3`; // Save file as songName.mp3

    // Authorize with Google Drive
    await authorize();

    // Upload the audio file to Google Drive
    const googleDriveFileData = await uploadFileToDrive(
      audioFile.buffer,
      fileName
    );

    // Save the song metadata (Google Drive file ID, etc.) in MongoDB
    const newSong = new Song({
      songId: extractedSongName.replace(/\s+/g, ""), // Remove spaces for songId
      songName: extractedSongName,
      artistName: extractedArtistName,
      lyrics,
      audioFile: googleDriveFileData.id, // Save the Google Drive file ID
    });

    await newSong.save();

    res
      .status(201)
      .json({ message: "Song created and uploaded to Google Drive", newSong });
  } catch (error) {
    console.error("Error creating song:", error);
    res
      .status(500)
      .json({ message: "Error creating song and uploading to Google Drive" });
  }
};

// Get all songs with artist details
exports.getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find().sort({ songName: 1 }); // Assuming you want to populate artist details
    
    if (songs.length === 0) {
      return res.status(200).json([]); // Return an empty array instead of 404
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
            .jpeg({ quality: 90 }) // High compression quality
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
          highQualityThumbnailUrl = "/thumbnails/default-thumbnail-low.jpg";
          lowQualityThumbnailUrl = "/thumbnails/default-thumbnail-low.jpg";
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
          songName: song.songName || songName,
          audioUrl: `/stream/${fileId}`, // Stream URL for Google Drive file ID
          artistName: song.artistName || artistName,
          favourite: song.favourite || false, // Include favourite status
          highQualityThumbnailUrl,
          lowQualityThumbnailUrl,
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
  console.log("songid",  songId);
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
    // Find the song by songId
    const song = await Song.findOne({ songId });

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
