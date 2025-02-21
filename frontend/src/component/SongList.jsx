import React, { useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import apiService from "../services/apiService"; // Import your apiService
import MusicAnimation from "./MusicAnimation";

function SongList({
  id,
  title,
  image,
  isAdminLogin,
  currentlyPlaying,
  artist,
  favourite,
  handlePlayer,
  handleToggleEdit,
  fetchSongs,
  songId,
  isPlaying,
}) {
  const [isDeleting, setIsDeleting] = useState(false); // State to track if a song is being deleted

  const handleDeleteSong = async (songId, filename) => {
    const songfile = filename + ".mp3";

    // Show confirmation dialog
    if (confirm("Do you really want to delete this song?")) {
      setIsDeleting(true); // Set isDeleting to true when deletion starts

      try {
        // Call the API to delete the song and the file
        const response = await apiService.deleteSong(songId, songfile); // Pass songId and filename to API
        fetchSongs(); // Refresh the song list after deleting the song
      } catch (err) {
        alert("Failed to delete song");
      } finally {
        setIsDeleting(false); // Set isDeleting to false when operation is complete (either success or error)
      }
    }
  };
  return (
    <div
      onClick={() => {
        handlePlayer(id, title, artist);
      }}
      className="relative group flex flex-col space-y-2 bg-white dark:bg-slate-900 dark:border dark:border-white/10 border border-gray-200 md:shadow-lg rounded-2xl p-4 md:hover:ring-2 hover:ring-gray-500 hover:ring-opacity-50
           ring-offset-2 transition-all duration-300 ease-in-out cursor-pointer hover:shadow-xl"
           
    >
      {/* {isPlaying && <div className="absolute top-3 right-3">
        
      </div>} */}
      {!isDeleting && isAdminLogin && (
        <>
          <button
            title="Edit"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleEdit(songId);
            }}
            className="absolute bottom-2 right-2 p-2 bg-white text-black border rounded-lg text-sm opacity-0 group-hover:opacity-100  transition-opacity duration-300"
            
          >
            <FiEdit2 />
          </button>
          <button
            title="Delete"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteSong(id, songId); // Call the delete function when clicked
              console.log(id);
            }}
            className="absolute bottom-2 right-12 p-2 bg-white text-black border rounded-lg text-sm opacity-0 group-hover:opacity-100  transition-opacity duration-300"
          >
            <AiOutlineDelete />
          </button>
        </>
      )}
      {isDeleting && (
        <div className="absolute bottom-2 text-xs right-2 p-2 bg-white text-black border rounded-lg transition-opacity duration-300">
          Deleting...
        </div>
      )}
      {currentlyPlaying && <div className="absolute top-2 text-xs right-2 px-2 py-1 bg-white text-black border rounded-lg transition-opacity duration-300">
        Now playing
      </div>}

      <div className="flex w-full h-full space-x-4 items-center">
        {/* Album Artwork Placeholder */}
        <div
          className={`flex-shrink-0 ${
            isAdminLogin ? "w-[100px] h-[100px]" : "w-16 h-16"
          } bg-cover overflow-hidden rounded-md bg-gray-300 flex items-center justify-center`}
          style={
            currentlyPlaying && image
              ? {
                  backgroundImage: `url(${
                    import.meta.env.VITE_BASEURL
                  }/assets${image})`,
                }
              : {}
          }
        >
          {!currentlyPlaying ? (
            <svg
              className="w-full h-full"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="0"
              viewBox="-326 -156 512 512"
            >
              <path
                className="fill-gray-500"
                d="M0 0 C1.24455328 0.67478142 2.48918277 1.34942231 3.73388672 2.02392578 
            C6.14190729 3.33069933 8.54745646 4.64186887 10.95117188 5.95654297 
            C13.52788792 7.36184426 16.11200527 8.75048378 18.703125 10.12890625 
            C32.52307084 17.5832136 42.81289154 27.17205946 47.43359375 42.46484375 
            C50.41353243 56.35438846 47.61804272 72.76626096 40.78125 85.1328125 
            C36.22349947 92.1629277 30.27158114 97.33358837 22.125 99.6875 
            C8.62362736 102.02401403 -1.27971168 98.17494209 -12.875 91.6875 
            C-14.73025249 90.68728274 -16.58710684 89.69003262 -18.4453125 88.6953125 
            C-23.04164928 86.22249255 -27.61480075 83.71077862 -32.17871094 81.17871094 
            C-36.7324351 78.66022604 -41.30401286 76.17447715 -45.875 73.6875 
            C-48.64080075 86.96982279 -50.97091178 100.32512286 -53.3125 113.6875 
            C-53.69841294 115.88153764 -54.08447987 118.07554821 -54.47070312 120.26953125 
            C-54.85418129 122.45051826 -55.23764489 124.63150783 -55.62109375 126.8125 
            C-55.80947311 127.88216507 -55.99785248 128.95183014 -56.19194031 130.0539093 
            C-57.13596042 135.42650821 -58.06603065 140.80092256 -58.9699707 146.18041992 
            C-59.14613419 147.21976685 -59.32229767 148.25911377 -59.50379944 149.32995605 
            C-59.83411306 151.28251201 -60.16037043 153.23576055 -60.48167419 155.18981934 
            C-63.07880856 170.48019526 -69.70546522 183.71179292 -81.875 193.6875 
            C-95.08697217 202.67597287 -108.92922449 206.80672394 -124.875 203.9375 
            C-140.29533425 200.39960686 -153.24179988 192.58688415 -162.0625 179.1875 
            C-169.74695545 165.4396934 -172.19454811 150.87628619 -168.3125 135.5 
            C-163.4140907 120.36101378 -154.11530023 108.74978863 -140.06640625 101.16015625 
            C-126.27137562 94.79451788 -112.32941512 93.46210583 -97.890625 98.4765625 
            C-91.76692807 100.93555997 -86.08705282 103.61004371 -80.875 107.6875 
            C-80.90674316 106.55675049 -80.93848633 105.42600098 -80.97119141 104.26098633 
            C-80.96667211 99.55090623 -80.22416288 95.12581587 -79.3359375 90.51171875 
            C-79.1745932 89.64075058 -79.0132489 88.76978241 -78.84701538 87.87242126 
            C-78.32103065 85.03872123 -77.78555807 82.20690478 -77.25 79.375 
            C-76.50953447 75.40819682 -75.77396953 71.44049255 -75.0390625 67.47265625 
            C-74.85432373 66.47848694 -74.66958496 65.48431763 -74.47924805 64.46002197 
            C-73.31164376 58.14770965 -72.20085548 51.8285934 -71.1484375 45.49609375 
            C-71.01686249 44.70770615 -70.88528748 43.91931854 -70.74972534 43.10704041 
            C-70.25518591 40.13601045 -69.76167593 37.16494038 -69.28485107 34.19100952 
            C-64.38777303 3.65418473 -64.38777303 3.65418473 -52.5 -6.1875 
            C-34.45823271 -19.08302521 -17.30418406 -9.43145152 0 0 Z "
                fill=""
              />
            </svg>
          ) : (
            <MusicAnimation isPlaying={isPlaying} />
          )}
        </div>

        {/* Song Details */}
        <div
          className={`${
            isAdminLogin ? "flex-col items-start gap-2" : "items-center"
          } flex justify-end w-full`}
        >
          <div className="flex-1 w-full">
            <h3
              title={title}
              className="text-lg line-clamp-2 font-semibold dark:text-white text-gray-800"
            >
              {title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 ">{artist}</p>
          </div>

          {/* Favourite Icon */}
          <div className="flex items-center space-x-4">
            <svg
              className={`h-6 w-6 ${
                favourite ? "text-red-500" : "text-gray-400"
              }`}
              fill={favourite ? "#ef4444" : "none"}
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SongList;
