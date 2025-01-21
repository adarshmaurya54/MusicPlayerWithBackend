import React, { useState } from "react";
import { MdOutlineDeleteSweep } from "react-icons/md";
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import apiService from "../services/apiService"; // Import your apiService
import MusicAnimation from "./MusicAnimation";

function SongList({
  id,
  title,
  isAdminLogin,
  artist,
  favourite,
  handlePlayer,
  handleToggleEdit,
  fetchSongs,
  songId,
  isPlaying
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
  console.log(id);
  
  return (
    <div
      onClick={() => {
        handlePlayer(id, title, artist);
      }}
      className="relative group flex flex-col space-y-2 bg-white border border-gray-200 shadow-lg rounded-xl p-4 md:hover:ring-2 hover:ring-gray-500 hover:ring-opacity-50
           ring-offset-2  transition-all duration-300 ease-in-out cursor-pointer hover:shadow-xl"
    >
      {isPlaying && <div className="absolute top-3 right-3">
        <MusicAnimation /> 
      </div>}
      {!isDeleting && isAdminLogin && (
        <>
          <button
            title="Edit"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleEdit(songId);
            }}
            className="absolute bottom-2 right-2 p-2 bg-white text-black border rounded-md text-sm opacity-0 group-hover:opacity-100  transition-opacity duration-300"
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
            className="absolute bottom-2 right-12 p-2 bg-white text-black border rounded-md text-sm opacity-0 group-hover:opacity-100  transition-opacity duration-300"
          >
            <AiOutlineDelete />
          </button>
        </>
      )}
      {isDeleting && (
        <div className="absolute bottom-2 text-xs right-2 p-2 bg-white text-black border rounded-md transition-opacity duration-300">
          Deleting...
        </div>
      )}

      <div className="flex w-full h-full space-x-4 items-center">
        {/* Album Artwork Placeholder */}
        <div
          className={`flex-shrink-0 ${
            isAdminLogin ? "w-[100px] h-[100px]" : "w-16 h-16"
          } rounded-md bg-gray-300 flex items-center justify-center`}
        >
          <svg
            className="h-8 w-8 text-gray-500"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M9 18V5l12-2v13"></path>
            <circle cx="6" cy="18" r="3"></circle>
            <circle cx="18" cy="16" r="3"></circle>
          </svg>
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
              className="text-lg line-clamp-2 font-semibold text-gray-800"
            >
              {title}
            </h3>
            <p className="text-sm text-gray-600 ">{artist}</p>
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
