const Song = require('../models/songModel');
const path = require('path');
const fs = require('fs');
const musicMetadata = require('music-metadata');
const sharp = require('sharp');  // For resizing image

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
  const thumbnailFolder = path.join(__dirname, '..', 'assets', 'thumbnails'); // Path to store the thumbnail images

  console.log('Audio file path:', audioFilePath);
  console.log('Thumbnail folder path:', thumbnailFolder);

  // Check if the audio file exists
  if (fs.existsSync(audioFilePath)) {
    try {
      // Ensure the thumbnails folder exists, if not, create it
      if (!fs.existsSync(thumbnailFolder)) {
        console.log('Creating thumbnail folder...');
        fs.mkdirSync(thumbnailFolder, { recursive: true });
      }

      // Extract metadata from the audio file
      const metadata = await musicMetadata.parseFile(audioFilePath);

      // Extract song title (or default to the filename)
      const songName = metadata.common.title || filename;

      // Extract artist (or default to 'Unknown Artist')
      const artistName = metadata.common.artist || 'Unknown Artist';

      // Extract thumbnail if available
      const imageData = metadata.common.picture ? metadata.common.picture[0] : null;
      let highQualityThumbnailUrl = null;
      let lowQualityThumbnailUrl = null;

      if (imageData) {
        const imageBuffer = Buffer.from(imageData.data);

        // Define file paths for high and low-quality thumbnails
        const highQualityThumbnailPath = path.join(thumbnailFolder, `${filename}-high.jpg`);
        const lowQualityThumbnailPath = path.join(thumbnailFolder, `${filename}-low.jpg`);

        console.log('High-quality thumbnail path:', highQualityThumbnailPath);
        console.log('Low-quality thumbnail path:', lowQualityThumbnailPath);

        // Generate and save high-quality thumbnail (300x300)
        await sharp(imageBuffer)
          .resize(300, 300) // High-quality size
          .toFile(highQualityThumbnailPath);
        highQualityThumbnailUrl = `/thumbnails/${filename}-high.jpg`; // URL to access high-quality thumbnail

        // Generate and save low-quality thumbnail (100x100)
        await sharp(imageBuffer)
          .resize(100, 100) // Low-quality size
          .toFile(lowQualityThumbnailPath);
        lowQualityThumbnailUrl = `/thumbnails/${filename}-low.jpg`; // URL to access low-quality thumbnail
      } else {
        // Fallback to a default thumbnail if no image is found
        highQualityThumbnailUrl = '/thumbnails/default-thumbnail-high.jpg';
        lowQualityThumbnailUrl = '/thumbnails/default-thumbnail-low.jpg';
      }

      // Respond with song details (audio URL, artist, song name, and thumbnail URLs)
      res.json({
        songName,
        audioUrl: `/assets/audio/${filename}.mp3`, // URL to access the audio file
        artistName,
        highQualityThumbnailUrl,
        lowQualityThumbnailUrl,
      });
    } catch (error) {
      console.error('Error extracting audio metadata:', error);
      res.status(500).json({ error: 'Error processing the audio file.' });
    }
  } else {
    res.status(404).json({ error: 'Audio file not found' });
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
