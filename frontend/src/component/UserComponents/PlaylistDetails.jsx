import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import defaultUser from "../../assets/default-user.jpg";
import { useSelector } from "react-redux";
import AddSongs from "./AddSongs";
import { API } from "../../services/apiService";
import { FaPlus } from "react-icons/fa";
import { IoEllipsisHorizontalSharp } from "react-icons/io5";
import { FiEdit2 } from "react-icons/fi";

function PlaylistDetails() {
    const location = useLocation();
    const [openAddSong, setOpenAddSong] = useState(false);
    const [playlist, setPlaylist] = useState(null); // ✅ Change to null to avoid length error
    const { id } = useParams();
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate()

    // Fetch playlist details
    const getPlaylistDetails = async () => {
        try {
            const response = await API.get(`/playlists/${id}`);
            setPlaylist(response.data[0]); // ✅ Set playlist data
        } catch (error) {
            console.log("Error fetching playlist details:", error);
            navigate('/')
        }
    };

    useEffect(() => {  
        getPlaylistDetails();
    }, []);

    // ✅ Show loading while fetching data
    if (!playlist) {
        return <div className="text-center mt-5">Loading playlist...</div>;
    }

    return (
        <div className="relative mt-5 bg-white md:bg-gray-100 p-4 rounded-3xl">
            <div className="absolute flex items-center gap-3 cursor-pointer top-5 right-5">
                <FiEdit2 title="Edit playlist" className="text-xl" />
                {playlist.songs.length !== 0 && <FaPlus title="Add song" onClick={() => setOpenAddSong(true)} className="text-xl" />}
            </div>
            {/* ✅ Playlist Header */}
            <div className="flex flex-col gap-2 border-b-2 pb-4">
                <p className="text-sm text-gray-400">Playlist</p>
                <h1 className="text-4xl md:text-7xl font-bold">{playlist?.name}</h1>
                <p className="text-sm font-bold text-gray-400">{playlist?.description}</p>
                <div className="flex gap-2 items-center">
                    <img
                        src={defaultUser} // Replace with actual profile image if available
                        alt="Profile"
                        className="border border-gray-100 w-7 h-7 object-cover rounded-full"
                    />
                    <div className="text-xs font-bold hover:underline cursor-pointer">
                        {user?.name}{" "}
                        <span className="text-gray-400">
                            • {playlist?.songs?.length || 0} song(s)
                        </span>
                    </div>
                </div>
            </div>

            {/* ✅ Playlist Songs */}
            <div className="mt-4">
                {playlist?.songs?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10">
                        <p className="text-gray-500 font-semibold mt-3">
                            No songs available in this playlist.
                        </p>
                        <button
                            onClick={() => setOpenAddSong(true)}
                            className="mt-4 bg-purple-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                        >
                            Add Songs
                        </button>
                    </div>
                ) : (
                    <div className="mt-2">
                        {playlist.songs?.map((song, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 hover:bg-gray-200 rounded-lg transition cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <p className="text-sm font-semibold">{index + 1}.</p>
                                    <div className="flex flex-col">
                                        <p className="text-sm font-medium">{song.songName}</p>
                                        <p className="text-xs text-gray-500">{song.artistName}</p>
                                    </div>
                                </div>
                                {/* Three-dot menu for song actions */}
                                <button className="text-gray-500 hover:text-gray-700">
                                    <IoEllipsisHorizontalSharp />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ✅ Add Songs Modal */}
            {openAddSong && (
                <AddSongs
                    setOpenAddSong={setOpenAddSong}
                    getPlaylistDetails={getPlaylistDetails}
                    playlistId={playlist._id}
                    onClose={() => setOpenAddSong(false)}
                    refreshPlaylist={getPlaylistDetails} // Refresh playlist after adding
                />
            )}
        </div>
    );
}

export default PlaylistDetails;
