import axios from "axios";

// Create an Axios instance with default settings
const API = axios.create({
  baseURL: import.meta.env.VITE_BASEURL, // Replace with your backend URL
  headers: {
    "Content-Type": "application/json", // Default header for JSON data
  }
});

// Interceptor to add the JWT token to the request header
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`; // Attach the token if available
    }
    return req; // Proceed with the request
  },
  (error) => {
    return Promise.reject(error); // Handle request error
  }
);

// Handle API calls
const apiService = {
  
  // Get all songs
  getSongs: async (favourite = "false", artist = 'all') => {
    try {
      const response = await API.get(`/songs/?favourite=${favourite}&artist=${artist}`);
      return response.data; // Return the data to be used in the component
    } catch (error) {
      throw new Error("Error fetching songs: " + error.message);
    }
  },

  // Get all artists
  getArtists: async () => {
    try {
      const response = await API.get("/artists");
      return response.data; // Return the data to be used in the component
    } catch (error) {
      throw new Error("Error fetching artists: " + error.message);
    }
  },

  // apiService.js
  createSong: async (formData) => {
    try {
      const response = await API.post("/songs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      // Check if the error response exists
      if (error.response) {
        console.error("Error in API call:", error.response.data);
        // Throw the error from the server
        throw error.response.data;
      } else {
        console.error("Error in API call:", error.message);
        // Throw a generic error if no server response
        throw new Error("Failed to create song");
      }
    }
  },

  // Create an artist
  createArtist: async (artistData) => {
    try {
      const response = await API.post("/artists", artistData);
      return response.data; // Return the created artist
    } catch (error) {
      throw new Error("Error creating artist: " + error.message);
    }
  },

  // Get song details by filename
  getSongInfo: async (filename) => {
    try {
      const response = await API.get(`/songs/${filename}`);
      return response.data; // Return the song info (artist name, thumbnail, etc.)
    } catch (error) {
      throw new Error("Error fetching song info: " + error.message);
    }
  },
  // get song by songId
  getSongById: async (songId) => {
    try {
      const response = await API.get(`/songs/songById/${songId}`); // Endpoint to fetch the specific song
      return response.data; // Return the song details
    } catch (error) {
      console.error(
        "Error fetching song by ID:",
        error.response || error.message
      );
      throw new Error("Failed to fetch song by ID");
    }
  },
  // Update song by songId
  updateSong: async (songId, updatedData) => {
    try {
      const response = await API.put(`/songs/${songId}`, updatedData);
      return response.data; // Return the updated song details
    } catch (error) {
      console.error("Error updating song:", error.response || error.message);
      throw new Error("Failed to update song");
    }
  },
  deleteSong: async (songId, filename) => {
    try {
      const response = await API.delete(`/songs/${songId}`, {
        data: { filename },
      }); // Pass filename in the body
      return response.data; // Return the success message
    } catch (error) {
      console.error("Error deleting song:", error.response || error.message);
      throw new Error("Failed to delete song");
    }
  },

  // Delete thumbnails by songId
  deleteThumbnails: async (songId) => {
    try {
      const response = await API.delete(`/songs/thumbnail/${songId}`); // Adjust the endpoint accordingly
      return response.data; // Return the confirmation message
    } catch (error) {
      console.error(
        "Error deleting thumbnails:",
        error.response || error.message
      );
      throw new Error("Failed to delete thumbnails");
    }
  },
  toggleFavourite: async (songId) => {
    try {
      const response = await API.patch(`/favourite/${songId}`); // Endpoint for toggling the favourite status
      return response.data; // Return the updated data (favourite status and message)
    } catch (error) {
      console.error(
        "Error toggling favourite status:",
        error.response || error.message
      );
      throw new Error("Failed to toggle favourite status");
    }
  },
};

export {API}
export default apiService;
