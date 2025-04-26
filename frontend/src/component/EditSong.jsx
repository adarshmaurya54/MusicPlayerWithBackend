import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaRegTimesCircle } from "react-icons/fa";
import { FaInfoCircle } from "react-icons/fa";
import apiService from "../services/apiService"; // Adjust path as needed

function EditSong({ songId, fetchSongs, handleToggleEdit }) {
  const [song, setSong] = useState(null); // State to store song data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const songData = await apiService.getSongById(songId); // Fetch song by ID
        setSong(songData.song); // Set song data to state
        setLoading(false); // Set loading to false after data is fetched
      } catch (err) {
        setError("Failed to fetch song data.");
        setLoading(false);
      }
    };

    if (songId) {
      fetchSong();
    }
  }, [songId]); // Run when songId changes

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSong((prevSong) => ({
      ...prevSong,
      [name]: value,
    }));
  };

  const handleUpdateSong = async () => {
    try {
      const updatedData = {
        songName: song.songName,
        artistName: song.artistName,
        lyrics: song.lyrics,
      };
      setUpdating(true);
      await apiService.updateSong(songId, updatedData);
      setUpdating(false);
      fetchSongs();
      handleToggleEdit(); // Close the modal on success
    } catch (err) {
      setError(err.message || "An error occurred while updating the song.");
    }
  };
  console.log(song);


  return (
    <div className="fixed z-50 top-0 left-0 bg-black/10 flex justify-center items-center w-full h-full backdrop-blur-lg">
      <div className="relative flex items-center justify-center w-full h-full md:w-[90%] md:h-[95%] bg-white dark:bg-slate-800 md:rounded-3xl md:p-6 shadow-lg transition-all">
        <div className="flex text-black dark:text-white absolute md:top-7 md:left-7 top-5 left-4 justify-between items-center">
          <FaArrowLeft
            onClick={handleToggleEdit}
            className="text-xl cursor-pointer"
          />
        </div>
        {loading && (
          <div className="w-full px-4 py-8 mt-5 rounded-2xl flex items-center justify-center">
            <div className="flex items-center justify-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 border-4 border-black/50 dark:border-white border-dashed rounded-full animate-spin"></div>
                <div className="text-black dark:text-white flex items-center gap-3 justify-center">
                  <FaInfoCircle className="text-3xl" />
                  <p className="text-3xl">Getting song info...</p>
                </div>
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="text-black flex flex-col items-center justify-center">
            <p className="text-3xl">{error}</p>
          </div>
        )}
        {!loading && !error && (
          <div className="form transition-all md:p-0 p-10 w-full md:w-[60%]">
            <form
              className="max-w-sm mx-auto"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="mb-5">
                <label
                  htmlFor="songname"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Song Name
                </label>
                <input
                  type="text"
                  id="songname"
                  name="songName" // Add name attribute to match the state key
                  className="border dark:border-none border-gray-300 dark:bg-slate-300 text-gray-900 text-sm rounded-lg dark:outline-none block w-full p-2.5"
                  value={song.songName} // Set song name from the fetched data
                  onChange={handleInputChange} // Handle input change
                  required
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="artistname"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Artist Name
                </label>
                <input
                  type="text"
                  id="artistname"
                  name="artistName" // Add name attribute to match the state key
                  className="border dark:border-none border-gray-300 dark:bg-slate-300 text-gray-900 text-sm rounded-lg dark:outline-none block w-full p-2.5"
                  value={song.artistName} // Set artist name from the fetched data
                  onChange={handleInputChange} // Handle input change
                  required
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="songlyrics"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Song Lyrics
                </label>
                <textarea
                  id="songlyrics"
                  name="lyrics" // Add name attribute to match the state key
                  rows="6"
                  className="resize-none border dark:border-none border-gray-300 dark:bg-slate-300 text-gray-900 text-sm rounded-lg dark:outline-none block w-full p-2.5"
                  value={song.lyrics} // Set song lyrics from the fetched data
                  onChange={handleInputChange} // Handle input change
                ></textarea>
              </div>
              <div className="mb-5 text-center">
                <button
                  type="button"
                  onClick={handleUpdateSong}
                  disabled={updating}
                  className={`bg-black w-full hover:outline outline-offset-2 outline-black text-white px-4 py-2 rounded-lg ${updating && "cursor-not-allowed"}`}
                >
                  {updating ? "Updating..." : "Update song"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditSong;
