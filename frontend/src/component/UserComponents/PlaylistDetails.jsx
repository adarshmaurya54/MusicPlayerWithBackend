import React from 'react'
import { useLocation } from 'react-router-dom';
import defaultUser from "../../assets/default-user.jpg"
import { useSelector } from 'react-redux';

function PlaylistDetails() {
    const location = useLocation();
    const { playlist } = location.state || { playlist: [] };
    const { user } = useSelector((state) => state.auth)

    return (
        <div className='mt-5 bg-gray-100 p-4 rounded-3xl'>
            {/* Playlist Header */}
            <div className="flex flex-col gap-2 border-b-2 pb-4">
                <p className='text-sm text-gray-400'>Playlist</p>
                <h1 className='text-4xl md:text-7xl font-bold'>{playlist.name}</h1>
                <p className='text-sm font-bold text-gray-400'>{playlist.description}</p>
                <div className="flex gap-2 items-center">
                    <img
                        src={defaultUser} // Replace with actual image URL
                        alt="Profile"
                        className="border border-gray-100 w-7 h-7 object-cover rounded-full"
                    />
                    <div className='text-xs font-bold hover:underline cursor-pointer'>
                        {user.name} <span className='text-gray-400'>• {playlist.songs.length} song(s)</span>
                    </div>
                </div>
            </div>

            {/* Playlist Songs */}
            <div className="mt-4">
                {playlist.songs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10">
                        <p className="text-gray-500 font-semibold mt-3">No songs available in this playlist.</p>
                        <button
                            className="mt-4 bg-purple-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                            onClick={() => navigate('/add-song')}
                        >
                            Add Songs
                        </button>
                    </div>
                ) : (
                    <div>
                        {/* Map through songs if available */}
                        {playlist.songs.map((song, index) => (
                            <div key={index} className="p-2 border-b text-sm">
                                🎵 {song.name} - {song.artist}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

    )
}

export default PlaylistDetails
