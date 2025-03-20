import React from 'react'
import { FaPlay } from "react-icons/fa";
import { Link } from 'react-router-dom';

function PlaylistCard({ playlist }) {
    return (
        <div
            className="w-full bg-gray-400 group overflow-hidden h-[220px] relative rounded-3xl transition-all duration-500"
        >
            {/* <div className="bg-black/40 absolute backdrop-blur-lg top-0 left-0 w-full h-full"></div> */}
            <img
                src={import.meta.env.VITE_BASEURL + "/assets/thumbnails/default-thumbnail-low.png"} // Replace with actual image URL
                alt="Profile"
                className="w-4 h-4 absolute top-2 left-2 object-cover rounded-full"
            />
            <p className='absolute bottom-4 left-4 text-5xl font-bold text-white'>{playlist.name}</p>
            <Link
                to={`/library/playlists/${playlist._id}`}
                state={{ playlist }}
                className="absolute cursor-pointer flex items-center justify-center bottom-1 group-hover:opacity-100 opacity-0 group-hover:bottom-2 transition-all duration-300 right-2 w-14 h-14 rounded-full"
                style={{
                    background: "linear-gradient(180deg, #8653C7, #6942BB, #5C3AB5)",
                }}
            >
                <FaPlay className='text-white text-xl' />
            </Link>
        </div>
    )
}

export default PlaylistCard
