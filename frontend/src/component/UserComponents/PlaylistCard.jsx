import React from "react";
import { FaPlay } from "react-icons/fa";
import { Link } from "react-router-dom";

function PlaylistCard({ playlist }) {
  return (
    <div
      className="w-full h-[240px] bg-gradient-to-tr from-[#6e42a6] via-[#7b4cb4] to-[#523291] group overflow-hidden relative rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500"
    >
      {/* Playlist Thumbnail with Overlay */}
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 backdrop-blur-sm transition-all duration-500"></div>

      <img
        src={
          playlist?.thumbnailUrl ||
          import.meta.env.VITE_BASEURL + "/assets/thumbnails/default-thumbnail-low.png"
        }
        alt={playlist.name}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-black/30 backdrop-blur-md"></div>

      {/* Playlist Info */}
      <div className="absolute bottom-4 left-4">
        <p className="text-2xl font-bold text-white group-hover:text-[#FFC857] transition-colors duration-300">
          {playlist.name}
        </p>
        <p className="text-sm text-gray-200">{playlist.description || "No description available"}</p>
      </div>

      {/* Play Button */}
      <Link
        to={`/library/playlists/${playlist._id}`}
        state={{ playlist }}
        className="absolute cursor-pointer flex items-center justify-center bottom-4 right-4 w-12 h-12 rounded-full bg-gradient-to-br from-[#FFC857] to-[#FF6B6B] shadow-md group-hover:scale-110 transition-all duration-300"
      >
        <FaPlay className="text-white text-lg" />
      </Link>

      {/* Badge for Playlist Count */}
      <div className="absolute top-2 right-2 bg-[#FFC857] text-black text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
        {playlist.songs.length || 0} Songs
      </div>
    </div>
  );
}

export default PlaylistCard;
