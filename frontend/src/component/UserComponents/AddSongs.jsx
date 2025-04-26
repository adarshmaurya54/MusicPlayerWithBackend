import React, { useEffect, useState } from "react";
import { API } from "../../services/apiService";
import { useParams } from "react-router-dom";
import { LiaTimesSolid } from "react-icons/lia";

const AddSongs = ({ setOpenAddSong, getPlaylistDetails }) => {
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [songs, setSongs] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const { id } = useParams();

  // Handle option click
  const handleOptionClick = (option) => {
    if (selectedSongs.includes(option)) {
      setSelectedSongs(selectedSongs.filter((item) => item !== option));
    } else {
      setSelectedSongs([...selectedSongs, option]);
    }
  };

  const loadSongs = async () => {
    try {
      const response = await API.get("/songs/?favourite=false&artist=all");
      setSongs(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadSongs();
  }, []);

  // Filtered songs based on search query
  const filteredSongs = songs.filter(
    (song) =>
      song.songName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artistName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSongs = async () => {
    try {
      const response = await API.post("/playlists/addSongs", {
        songs: selectedSongs,
        playlistId: id,
      });

      if (response.status === 200) {
        getPlaylistDetails();
        setOpenAddSong(false);
      }
    } catch (error) {
      console.error("Error adding songs:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative bg-white shadow-lg w-[90%] rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-500 px-4 py-2">
          <h2 className="text-sm font-semibold text-white">Add Songs to Playlist</h2>
          <button
            onClick={() => setOpenAddSong(false)}
            className="p-1 rounded-full bg-white hover:bg-gray-200 transition"
          >
            <LiaTimesSolid className="text-gray-700 text-lg" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search songs by name or artist..."
            className="w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Grid Song List with Filtered Songs */}
        <div className="p-4 max-h-[400px] overflow-auto grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filteredSongs.length > 0 ? (
            filteredSongs.map((option) => (
              <div
                key={option._id}
                onClick={() => handleOptionClick(option._id)}
                className={`relative group cursor-pointer rounded-lg p-2 shadow-sm border transition-all ${
                  selectedSongs.includes(option._id)
                    ? "bg-blue-100 border-blue-400"
                    : "bg-gray-50 hover:bg-gray-100 border-gray-200"
                }`}
              >
                {/* Checkbox Indicator */}
                <div
                  className={`absolute top-2 right-2 w-4 h-4 flex items-center justify-center rounded-full border ${
                    selectedSongs.includes(option._id) ? "border-blue-500" : "border-gray-300"
                  }`}
                >
                  {selectedSongs.includes(option._id) && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>

                {/* Song Details */}
                <div className="flex flex-col space-y-0.5">
                  <h3
                    className={`text-xs font-medium ${
                      selectedSongs.includes(option._id) ? "text-blue-700" : "text-gray-700"
                    }`}
                  >
                    {option.songName}
                  </h3>
                  <p className="text-[10px] text-gray-500">{option.artistName}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 sm:col-span-3 text-sm text-gray-500 text-center py-6">
              No songs found matching your search.
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-b-xl">
          <button
            onClick={() => handleAddSongs()}
            disabled={selectedSongs.length === 0}
            className={`px-4 py-1.5 text-xs rounded-lg text-white font-semibold transition-all ${
              selectedSongs.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Add {selectedSongs.length} {selectedSongs.length === 1 ? "Song" : "Songs"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSongs;
