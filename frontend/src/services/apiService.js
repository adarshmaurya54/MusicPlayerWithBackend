import axios from 'axios';

// Create an Axios instance with default settings
const apiClient = axios.create({
  baseURL: 'http://localhost:8080', // Replace with your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Handle API calls
const apiService = {
  // Get all songs
  getSongs: async () => {
    try {
      const response = await apiClient.get('/songs');
      return response.data; // return the data to be used in the component
    } catch (error) {
      throw new Error('Error fetching songs: ' + error.message);
    }
  },

  // Get all artists
  getArtists: async () => {
    try {
      const response = await apiClient.get('/artists');
      return response.data; // return the data to be used in the component
    } catch (error) {
      throw new Error('Error fetching artists: ' + error.message);
    }
  },

  // Create a song
  createSong: async (songData) => {
    try {
      const response = await apiClient.post('/song', songData);
      return response.data; // return the created song
    } catch (error) {
      throw new Error('Error creating song: ' + error.message);
    }
  },

  // Create an artist
  createArtist: async (artistData) => {
    try {
      const response = await apiClient.post('/artist', artistData);
      return response.data; // return the created artist
    } catch (error) {
      throw new Error('Error creating artist: ' + error.message);
    }
  },
};

export default apiService;
