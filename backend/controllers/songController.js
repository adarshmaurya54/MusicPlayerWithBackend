const Song = require('../models/songModel');
const path = require('path');
const fs = require('fs');
const musicMetadata = require('music-metadata');
const sharp = require('sharp');  // For resizing image
const { default: mongoose } = require('mongoose');

// Get a specific song by songId
exports.getSongById = async (req, res) => {
  const { songId } = req.params; // Extract songId from the request URL

  try {
    // Find the song in the database by songId
    const song = await Song.findOne({ songId });

    // If the song doesn't exist, return a 404 response
    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }

    // Respond with the song data
    res.status(200).json({ message: 'Song fetched successfully', song });
  } catch (error) {
    console.error('Error fetching song:', error);

    // Respond with a server error
    res.status(500).json({ error: 'Server error while fetching song' });
  }
};
// delete song by songid
exports.deleteSongById = async (req, res) => {
  try {
    const { songId } = req.params; // Get songId from URL parameters
    const { filename } = req.body; // Get filename from the request body

    // Ensure the filename exists before trying to delete it
    if (!filename) {
      return res.status(400).json({ message: "Filename is required to delete the song file" });
    }

    // Construct the file path
    const filePath = path.join(__dirname, '..', 'assets', 'audio', filename);

    // Delete the file from the server
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        return res.status(500).json({ message: "Error deleting song file from server" });
      }

      // If the file is deleted, proceed to delete the song record
      Song.findByIdAndDelete(songId)
        .then((song) => {
          if (!song) {
            return res.status(404).json({ message: "Song not found" });
          }

          // Send success response
          res.status(200).json({ message: "Song deleted successfully" });
        })
        .catch((err) => {
          console.error("Error deleting song:", err);
          res.status(500).json({ message: "Server error while deleting song record" });
        });
    });
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
        }
      },
      { new: true } // Return the updated song
    );

    // If song not found
    if (!updatedSong) {
      return res.status(404).json({ message: 'Song not found' });
    }

    // Send the updated song details in the response
    res.json(updatedSong);
  } catch (error) {
    console.error('Error updating song:', error);
    res.status(500).json({ message: 'Failed to update song' });
  }
};

// Create a new song
exports.createSong = async (req, res) => {
  const { songId, songName, poster, lyrics } = req.body;

  // Ensure the file is uploaded
  if (!req.file) {
    return res.status(400).json({ error: 'Audio file is required' });
  }

  const audioFilePath = path.join(__dirname, '..', 'assets', 'audio', req.file.filename);

  try {
    // Extract metadata from the audio file
    const metadata = await musicMetadata.parseFile(audioFilePath);

    // Extract artist name from metadata (default to 'Unknown Artist' if not available)
    const artistName = metadata.common.artist || 'Unknown Artist';

    // Extract song title from metadata (default to the provided songName or 'Untitled')
    const extractedSongName = metadata.common.title || songName || 'Untitled';

    // Create a new Song document
    const song = new Song({
      songId: songId.replace(/\s+/g, ''), // Remove spaces from songId
      songName: extractedSongName,       // Use extracted song name
      artistName,                        // Use extracted artist name
      poster,
      lyrics,
      audioFile: req.file.filename,      // Save the audio file name (e.g., songId.mp3)
    });

    // Save the song to the database
    await song.save();

    // Respond with success
    res.status(201).json({ message: 'Song uploaded successfully', song });
  } catch (error) {
    console.error('Error processing audio metadata:', error);

    // Respond with error
    res.status(500).json({ error: 'Server error while processing audio metadata' });
  }
};


// Get all songs with artist details
exports.getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find().sort({ songName: 1 }); // Assuming you want to populate artist details
    res.status(200).json(songs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve songs' });
  }
};

exports.getSongWithMetadata = async (req, res) => {
  const filename = req.params.filename;
  const audioFilePath = path.join(__dirname, '..', 'assets', 'audio', `${filename}.mp3`);
  const thumbnailFolder = path.join(__dirname, '..', 'assets', 'thumbnails'); // Path for thumbnail storage

  // Check if the audio file exists
  if (!fs.existsSync(audioFilePath)) {
    return res.status(404).json({ error: 'Audio file not found' });
  }

  try {
    // Ensure the thumbnails folder exists
    if (!fs.existsSync(thumbnailFolder)) {
      console.log('Creating thumbnail folder...');
      fs.mkdirSync(thumbnailFolder, { recursive: true });
    }

    // Extract metadata from the audio file
    const metadata = await musicMetadata.parseFile(audioFilePath);

    // Extract song and artist details with fallbacks
    const songName = metadata.common.title || filename;
    const artistName = metadata.common.artist || 'Unknown Artist';

    // Extract thumbnail data
    const imageData = metadata.common.picture ? metadata.common.picture[0] : null;
    let highQualityThumbnailUrl = null;
    let lowQualityThumbnailUrl = null;

    if (imageData) {
      const imageBuffer = Buffer.from(imageData.data);

      // Define file paths for high and low-quality thumbnails
      const highQualityThumbnailPath = path.join(thumbnailFolder, `${filename}-high.jpg`);
      const lowQualityThumbnailPath = path.join(thumbnailFolder, `${filename}-low.jpg`);

      console.log('Generating high-quality thumbnail...');
      await sharp(imageBuffer)
        .resize({ width: 600, height: 600, fit: 'cover' }) // High-quality size (e.g., 600x600)
        .toFormat('jpg')
        .jpeg({ quality: 90 }) // High compression quality
        .toFile(highQualityThumbnailPath);
      highQualityThumbnailUrl = `/thumbnails/${filename}-high.jpg`;

      console.log('Generating low-quality thumbnail...');
      await sharp(imageBuffer)
        .resize({ width: 100, height: 100, fit: 'cover' }) // Low-quality size (e.g., 100x100)
        .toFormat('jpg')
        .jpeg({ quality: 50 }) // Low compression quality
        .toFile(lowQualityThumbnailPath);
      lowQualityThumbnailUrl = `/thumbnails/${filename}-low.jpg`;
    } else {
      // Fallback to default thumbnails
      highQualityThumbnailUrl = '/thumbnails/default-thumbnail-low.jpg';
      lowQualityThumbnailUrl = '/thumbnails/default-thumbnail-low.jpg'; 
    }

    // Fetch song details from the database
    const song = await Song.findOne({ songId: filename });

    if (!song) {
      return res.status(404).json({ error: 'Song not found in the database.' });
    }

    // Respond with song details
    res.json({
      songName: song.songName || songName,
      audioUrl: `/stream/audio/${filename}.mp3`, // Audio file URL
      artistName: song.artistName || artistName,
      favourite: song.favourite || false, // Include favourite status
      highQualityThumbnailUrl,
      lowQualityThumbnailUrl,
    });
  } catch (error) {
    console.error('Error processing the audio file:', error);
    res.status(500).json({ error: 'Error processing the audio file.' });
  }
};


exports.deleteThumbnails = async (req, res) => {
  const songId = req.params.songId; // Get songId from the route parameter
  const thumbnailFolder = path.join(__dirname, '..', 'assets', 'thumbnails'); // Path to the thumbnails folder

  // Define file paths for high and low-quality thumbnails
  const highQualityThumbnailPath = path.join(thumbnailFolder, `${songId}-high.jpg`);
  const lowQualityThumbnailPath = path.join(thumbnailFolder, `${songId}-low.jpg`);

  try {
    // Check and delete the high-quality thumbnail if it exists
    if (fs.existsSync(highQualityThumbnailPath)) {
      fs.unlinkSync(highQualityThumbnailPath);
      console.log(`Deleted: ${highQualityThumbnailPath}`);
    } else {
      console.log(`High-quality thumbnail not found: ${highQualityThumbnailPath}`);
    }

    // Check and delete the low-quality thumbnail if it exists
    if (fs.existsSync(lowQualityThumbnailPath)) {
      fs.unlinkSync(lowQualityThumbnailPath);
      console.log(`Deleted: ${lowQualityThumbnailPath}`);
    } else {
      console.log(`Low-quality thumbnail not found: ${lowQualityThumbnailPath}`);
    }

    // Respond with success
    res.json({
      message: 'Thumbnails deleted successfully',
      songId,
    });
  } catch (error) {
    console.error('Error deleting thumbnails:', error);
    res.status(500).json({ error: 'Error deleting thumbnails' });
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
      return res.status(404).json({ message: 'Song not found' });
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
    console.error('Error toggling favourite status:', error);
    res.status(500).json({ error: 'Failed to toggle favourite status' });
  }
};
