import axios from 'axios';

// Create an Axios instance with default settings
const API = axios.create({
  baseURL: import.meta.env.VITE_BASEURL, // Replace with your backend URL
  headers: {
    'Content-Type': 'application/json', // Default header for JSON data
  },
});

// Interceptor to add the JWT token to the request header
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`; // Attach the token if available
  }
  return req; // Proceed with the request
}, (error) => {
  return Promise.reject(error); // Handle request error
});

// Handle API calls
const apiService = {
   // Login API call
   login: async (credentials) => {
    try {
      const response = await API.post('/login', credentials); // Adjust the endpoint accordingly
      return response.data; // Return the response data (token)
    } catch (error) {
      throw new Error('Error logging in: ' + error.message);
    }
  },
  // Get all songs
  getSongs: async () => {
    try {
      const response = await API.get('/songs');
      return response.data; // Return the data to be used in the component
    } catch (error) {
      throw new Error('Error fetching songs: ' + error.message);
    }
  },

  // Get all artists
  getArtists: async () => {
    try {
      const response = await API.get('/artists');
      return response.data; // Return the data to be used in the component
    } catch (error) {
      throw new Error('Error fetching artists: ' + error.message);
    }
  },

  // Create a song
  createSong: async (songData) => {
    try {
      const response = await API.post('/song', songData);
      return response.data; // Return the created song
    } catch (error) {
      throw new Error('Error creating song: ' + error.message);
    }
  },

  // Create an artist
  createArtist: async (artistData) => {
    try {
      const response = await API.post('/artist', artistData);
      return response.data; // Return the created artist
    } catch (error) {
      throw new Error('Error creating artist: ' + error.message);
    }
  },
};

export default apiService;
