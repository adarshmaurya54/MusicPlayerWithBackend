import React, { useEffect, useState } from "react";
import PlaylistCard from "../../component/UserComponents/PlaylistCard";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { API } from "../../services/apiService";
import { FaPlus } from "react-icons/fa6";
import InputType from "../../component/auth/InputType";
import { LiaTimesSolid } from "react-icons/lia";
import { PiPlaylistFill } from "react-icons/pi";
import { RiPlayListLine } from "react-icons/ri";

const Playlists = () => {
    const [playlists, setPlaylists] = useState([]);
    const { user } = useSelector((state) => state.auth);
    const [openCreatePlaylist, setOpenCreatePlaylist] = useState(false);
    const [playlistName, setPlaylistName] = useState("");
    const [playlistDescription, setPlaylistDescription] = useState("");

    // Fetch all playlists
    const getAllPlaylists = async () => {
        try {
            const response = await API.get(`/playlists`);
            setPlaylists(response.data);
        } catch (error) {
            console.error("Error getting playlists:", error);
            toast.error("Failed to get playlists!");
        }
    };

    useEffect(() => {
        if (user?._id) getAllPlaylists(user._id);
    }, [user?._id]);

    // Create a new playlist
    const handleCreatePlaylist = async (e) => {
        e.preventDefault();
        const toastId = toast.loading("Creating...");
        try {
            const response = await API.post("/playlists/create", {
                name: playlistName,
                description: playlistDescription,
            });

            toast.success("Playlist Created Successfully!", { id: toastId });

            setPlaylistName("");
            setPlaylistDescription("");
            setOpenCreatePlaylist(false);
            getAllPlaylists();
        } catch (error) {
            console.error("Error creating playlist:", error);
            toast.error("Failed to create playlist!", { id: toastId });
        }
    };

    return (
        <>{playlists.length === 0 ? <div className="flex flex-col items-center justify-center mt-5 text-xl font-bold">

            No Playlists
            <button
                onClick={() => setOpenCreatePlaylist(true)}
                className="mt-4 flex items-center text-sm bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
            >
                <FaPlus className="mr-2" /> Create Playlist
            </button>
        </div>
            :
            <div className="mt-5 transition-all duration-300">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-lg flex items-center gap-3 sm:text-xl font-bold text-gray-700 dark:text-white">
                        <PiPlaylistFill />
                        Your Playlists
                    </h1>
                    <button
                        onClick={() => setOpenCreatePlaylist(true)}
                        className="flex items-center bg-black text-white px-3 py-1.5 rounded-lg shadow-md"
                    >
                        <FaPlus className="mr-2 text-sm" /> Create Playlist
                    </button>
                </div>

                {/* Playlist Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5">
                    {playlists.map((playlist) => (
                        <PlaylistCard key={playlist._id} playlist={playlist} />
                    ))}
                </div>
            </div>}
            {/* Create Playlist Modal */}
            {openCreatePlaylist && (
                <div className="fixed md:p-0 px-4 inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <form
                        onSubmit={handleCreatePlaylist}
                        className="relative bg-gradient-to-t from-white to-blue-50 border border-gray-200 dark:border-gray-700 w-full max-w-md p-6 rounded-2xl shadow-xl"
                    >
                        {/* Modal Header */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="flex items-center gap-3 text-lg font-semibold text-gray-800 dark:text-white">
                                <PiPlaylistFill /> Create New Playlist
                            </h2>
                            <button
                                type="button"
                                onClick={() => setOpenCreatePlaylist(false)}
                                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                            >
                                <LiaTimesSolid className="text-gray-700 dark:text-white" />
                            </button>
                        </div>

                        {/* Playlist Name Input */}
                        <InputType
                            extraClass="mb-4"
                            inputType="text"
                            placeholder="Playlist Name"
                            value={playlistName}
                            icon={<RiPlayListLine />}
                            onChange={(e) => setPlaylistName(e)}
                        />

                        {/* Playlist Description Input */}
                        <textarea
                            value={playlistDescription}
                            onChange={(e) => setPlaylistDescription(e.target.value)}
                            placeholder="Add an optional description"
                            className="w-full p-3 rounded-lg shadow-md resize-none focus:ring-2 focus:ring-black dark:bg-gray-700 dark:text-white"
                            rows={4}
                        />

                        {/* Action Buttons */}
                        <div className="mt-5 flex justify-end space-x-3">
                            <button
                                type="submit"
                                className="bg-gray-600 hover:bg-black text-white px-4 py-2 rounded-lg transition-all"
                            >
                                Create
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default Playlists;
