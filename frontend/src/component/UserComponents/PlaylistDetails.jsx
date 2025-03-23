import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import defaultUser from "../../assets/default-user.jpg";
import { useSelector } from "react-redux";
import AddSongs from "./AddSongs";
import { API } from "../../services/apiService";
import { FaPlus } from "react-icons/fa";
import { IoEllipsisHorizontalSharp } from "react-icons/io5";
import { FiEdit2 } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { LiaTimesSolid } from "react-icons/lia";
import InputType from "../auth/InputType";
import toast from "react-hot-toast";

function PlaylistDetails() {
    const [openAddSong, setOpenAddSong] = useState(false);
    const [openEditPlaylist, setOpenEditPlaylist] = useState(false);
    const [playlist, setPlaylist] = useState(null); // ✅ Change to null to avoid length error
    const { id } = useParams();
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate()
    const [playlistName, setPlaylistName] = useState('')
    const [playlistDescription, setPlaylistDescription] = useState('')
    const [btnDisabled, setBtnDisabled] = useState(false)



    // Fetch playlist details
    const getPlaylistDetails = async () => {
        try {
            const response = await API.get(`/playlists/${id}`);
            setPlaylist(response.data[0]); // ✅ Set playlist data
            setPlaylistName(response.data[0].name)
            setPlaylistDescription(response.data[0].description)
        } catch (error) {
            console.log("Error fetching playlist details:", error);
            navigate('/')
        }
    };

    useEffect(() => {
        getPlaylistDetails();
    }, []);

    const handleUpdatePlaylist = async (e) => {
        e.preventDefault()
        setBtnDisabled(true)
        // Validate name before submitting
        if (!playlistName.trim()) {
            toast.error("Playlist name cannot be empty!")
            return
        }
        try {
            const res = await API.put("/playlists/edit", { id, playlistName, playlistDescription })

            // Check response status
            if (res.status === 200) {
                toast.success('Playlist updated successfully!')
                setOpenEditPlaylist(false) // Close modal on success
                setPlaylist(res.data.playlist)
                setBtnDisabled(false)
            } else {
                toast.error('Failed to update playlist!')
            }
        } catch (error) {
            console.error('Error updating playlist:', error)
            const errorMessage =
                error.response?.data?.error || 'Error updating playlist!'
            toast.error(errorMessage)
        }
    }

    const handleDeletePlaylist = async () => {
        const toastId = toast.loading("Deleting your playlist....")
        try {
            const res = await API.delete(`/playlists/delete/${ id }` )
            if (res.status === 200){
                toast.success(res.data.message || 'Playlist deleted successfully!', {id: toastId})
                navigate('/library/playlists')
            }
        } catch (error) {
            console.error('Error deleting playlist:', error)
            const errorMessage =
                error.response?.data?.error || 'Error deleting playlist!'
            toast.error(errorMessage, {id: toastId})
        }
    }

    // ✅ Show loading while fetching data
    if (!playlist) {
        return <div className="text-center mt-5">Loading playlist...</div>;
    }

    return (
        <div className="relative mt-5 bg-white md:bg-gray-100 p-4 rounded-3xl">
            <div className="absolute flex items-center gap-3 cursor-pointer top-5 right-5">
                <MdDelete onClick={() => handleDeletePlaylist()} title="Delete Playlist" className="text-xl" />
                <FiEdit2 onClick={() => { setOpenEditPlaylist(true); setPlaylistName(playlist.name); setPlaylistDescription(playlist.description) }} title="Edit playlist" className="text-xl" />
                {playlist.songs.length !== 0 && <FaPlus title="Add song" onClick={() => setOpenAddSong(true)} className="text-xl" />}
            </div>
            {/* ✅ Playlist Header */}
            <div className="flex flex-col gap-2 border-b-2 pb-4">
                <p className="text-sm text-gray-400">Playlist</p>
                <h1 className="text-4xl md:text-7xl font-bold">{playlist?.name}</h1>
                <p className="text-sm mt-2 text-gray-400">{playlist?.description}</p>
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
                                <div className="flex flex-col">
                                    <p className="text-sm font-medium">{song.songName}</p>
                                    <p className="text-xs text-gray-500">{song.artistName}</p>
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
            {openEditPlaylist && (
                <div className="fixed top-0 left-0 w-full h-full bg-black/20 backdrop-blur-md flex items-center justify-center">
                    <form
                        onSubmit={(e) => handleUpdatePlaylist(e)} // Update here
                        className="relative bg-gradient-to-t from-white to-blue-50 border-4 border-white w-[500px] p-5 pt-9 rounded-3xl"
                    >
                        {/* Input for Name */}
                        <InputType
                            extraClass="mb-5"
                            inputType="text"
                            placeholder="Add a name"
                            value={playlistName}
                            onChange={(e) => setPlaylistName(e)} // Ensure value change works
                        />

                        {/* Textarea for Description */}
                        <textarea
                            value={playlistDescription}
                            onChange={(e) => setPlaylistDescription(e.target.value)}
                            placeholder="Add an optional description"
                            className="w-full no-scrollbar placeholder:text-sm md:placeholder:text-base border-none pr-6 pl-8 py-3 rounded-2xl shadow-lg placeholder-gray-400 focus:outline focus:outline-2 outline-offset-2 resize-none"
                            rows={4}
                        />

                        {/* Close Button */}
                        <button
                            type="button"
                            onClick={() => setOpenEditPlaylist(false)}
                            className="p-1 absolute top-2 right-2 rounded-full hover:bg-gray-200"
                        >
                            <LiaTimesSolid />
                        </button>

                        {/* Submit Button */}
                        <button
                            disabled={btnDisabled}
                            type="submit"
                            className="mt-5 bg-black text-white font-medium px-6 py-3 rounded-2xl shadow-lg hover:bg-gray-900 transition-all duration-300"
                        >
                            {btnDisabled ? "Updating..." : "Update"}
                        </button>
                    </form>
                </div>
            )}

        </div>
    );
}

export default PlaylistDetails;
