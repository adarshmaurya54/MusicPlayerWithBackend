import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom";
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
import MusicAnimation from "../MusicAnimation";
import { AiTwotoneDelete } from "react-icons/ai";
import SongList from "../SongList";

function PlaylistDetails() {
    const [openAddSong, setOpenAddSong] = useState(false);
    const [openEditPlaylist, setOpenEditPlaylist] = useState(false);
    const [playlist, setPlaylist] = useState(null);
    const { id } = useParams();
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [playlistName, setPlaylistName] = useState('');
    const [playlistDescription, setPlaylistDescription] = useState('');
    const [btnDisabled, setBtnDisabled] = useState(false);
    const { player, setPlayer, songDetail, setSongList, isPlaying } = useOutletContext();

    // Fetch playlist details
    const getPlaylistDetails = async () => {
        try {
            const response = await API.get(`/playlists/${id}`);
            setPlaylist(response.data[0]);
            setPlaylistName(response.data[0].name);
            setPlaylistDescription(response.data[0].description);
        } catch (error) {
            console.log("Error fetching playlist details:", error);
            navigate('/');
        }
    };

    useEffect(() => {
        getPlaylistDetails();
    }, []);

    const handleUpdatePlaylist = async (e) => {
        e.preventDefault();
        setBtnDisabled(true);

        if (!playlistName.trim()) {
            toast.error("Playlist name cannot be empty!");
            setBtnDisabled(false);
            return;
        }
        try {
            const res = await API.put("/playlists/edit", { id, playlistName, playlistDescription });
            if (res.status === 200) {
                toast.success("Playlist updated successfully!");
                setOpenEditPlaylist(false);
                setPlaylist(res.data.playlist);
            } else {
                toast.error("Failed to update playlist!");
            }
        } catch (error) {
            console.error("Error updating playlist:", error);
            toast.error("Error updating playlist!");
        } finally {
            setBtnDisabled(false);
        }
    };

    const handleDeletePlaylist = async () => {
        if (confirm("Do you really want to delete the playlist?")) {
            const toastId = toast.loading("Deleting your playlist...");
            try {
                const res = await API.delete(`/playlists/delete/${id}`);
                if (res.status === 200) {
                    toast.success("Playlist deleted successfully!", { id: toastId });
                    navigate("/library/playlists");
                }
            } catch (error) {
                console.error("Error deleting playlist:", error);
                toast.error("Error deleting playlist!", { id: toastId });
            }
        }
    };

    const handleDeleteSong = async (songId) => {
        if (confirm("Do you really want to delete this song?")) {
            const toastId = toast.loading("Deleting song...");
            try {
                const res = await API.put(`/playlists/${id}/delete-song`, { songId });
                if (res.status === 200) {
                    toast.success("Song deleted successfully!", { id: toastId });
                    getPlaylistDetails(); // Refresh playlist after deletion
                }
            } catch (error) {
                console.error("Error deleting song:", error);
                toast.error("Error deleting song!", { id: toastId });
            }
        }
    };

    if (!playlist) {
        return <div className="text-center text-gray-500 mt-5">Loading playlist...</div>;
    }

    return (
        <div className={`relative mt-5 md:bg-white md:p-6 rounded-3xl w-full ${player !== undefined && player !== 0 ? "mb-12" : "mb-0"}`}>
            {/* ✅ Playlist Header */}
            <div className="flex flex-col md:bg-transparent bg-white p-5 border rounded-3xl gap-4 md:pb-4 md:border-b md:border-x-0 md:border-t-0 md:rounded-none">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold">{playlist?.name}</h1>
                        <p className="text-sm mt-1 text-gray-500">{playlist?.description || "No description available"}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <MdDelete
                            onClick={() => handleDeletePlaylist()}
                            title="Delete Playlist"
                            className="text-2xl text-gray-600 cursor-pointer hover:scale-110 transition"
                        />
                        <FiEdit2
                            onClick={() => setOpenEditPlaylist(true)}
                            title="Edit Playlist"
                            className="text-xl text-gray-500 cursor-pointer hover:scale-110 transition"
                        />
                        <FaPlus
                            title="Add Song"
                            onClick={() => setOpenAddSong(true)}
                            className="text-xl text-gray-500 cursor-pointer hover:scale-110 transition"
                        />
                    </div>
                </div>
                <div className="flex gap-2 items-center">
                    <img
                        src={defaultUser}
                        alt="Profile"
                        className="border border-gray-200 w-8 h-8 object-cover rounded-full"
                    />
                    <div className="text-sm font-bold">
                        {user?.name}{" "}
                        <span className="text-gray-400 font-normal">
                            • {playlist?.songs?.length || 0} song(s)
                        </span>
                    </div>
                </div>
            </div>

            {/* ✅ Song List */}
            <div className="mt-6">
                {playlist?.songs?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10">
                        <p className="text-gray-500 font-semibold">No songs available in this playlist.</p>
                        <button
                            onClick={() => setOpenAddSong(true)}
                            className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                        >
                            Add Songs
                        </button>
                    </div>
                ) : (
                    <div className="mt-2 grid gap-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-5">
                            {playlist.songs?.map((song, index) => (
                                <div onClick={() => {setPlayer(song.audioFile); setSongList(playlist.songs)}}>
                                    <SongList
                                        currentlyPlaying={player === song.audioFile}
                                        isPlaying={isPlaying}
                                        key={song.songId}
                                        image={
                                            songDetail?.highQualityThumbnailUrl
                                                ? songDetail?.highQualityThumbnailUrl
                                                : "/thumbnails/default-thumbnail-low.png"
                                        }
                                        id={song._id}
                                        likes={song.likes}
                                        songId={song.songId}
                                        audioFile={song.audioFile}
                                        title={song.songName}
                                        artist={song.artistName}
                                        favourite={song.favourite}
                                    />
                                </div>
                            ))}
                        </div>
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
                    refreshPlaylist={getPlaylistDetails}
                />
            )}

            {/* ✅ Edit Playlist Modal */}
            {openEditPlaylist && (
                <div className="fixed px-4 md:px-0 top-0 left-0 w-full h-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                    <form
                        onSubmit={(e) => handleUpdatePlaylist(e)}
                        className="relative bg-white w-[500px] p-6 rounded-3xl shadow-2xl"
                    >
                        <h2 className="text-2xl font-bold mb-4">Edit Playlist</h2>

                        <InputType
                            extraClass="mb-4"
                            inputType="text"
                            placeholder="Add a name"
                            value={playlistName}
                            onChange={(e) => setPlaylistName(e)}
                        />

                        <textarea
                            value={playlistDescription}
                            onChange={(e) => setPlaylistDescription(e.target.value)}
                            placeholder="Add an optional description"
                            className="w-full shadow-md rounded-xl p-3 placeholder:text-sm resize-none focus:ring-2 focus:ring-black"
                            rows={4}
                        />
                        <div className="flex justify-end mt-4 gap-3">
                            <button
                                type="button"
                                onClick={() => setOpenEditPlaylist(false)}
                                className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={btnDisabled}
                                type="submit"
                                className={`bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition ${btnDisabled && "opacity-50 cursor-not-allowed"
                                    }`}
                            >
                                {btnDisabled ? "Updating..." : "Update"}
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={() => setOpenEditPlaylist(false)}
                            className="p-1 absolute top-2 right-2 rounded-full hover:bg-gray-200"
                        >
                            <LiaTimesSolid />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default PlaylistDetails;
