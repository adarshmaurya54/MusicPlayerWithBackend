import React, { useEffect, useState } from "react";
import PlaylistCard from "./PlaylistCard";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { API } from "../../services/apiService";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import InputType from "../auth/InputType";
import { LiaTimesSolid } from "react-icons/lia";

const Playlists = () => {
    const [playlists, setPlaylists] = useState([])
    const { user } = useSelector((state) => state.auth)
    const [openCreatePlaylist, setOpenCreatePlaylist] = useState(false)
    const [playlistName, setPlaylistName] = useState('')
    const [playlistDescription, setPlaylistDescription] = useState('')


    const getAllPlaylists = async () => {
        const toastId = toast.loading("Getting your playlists...")
        try {
            const response = await API.get(`/playlists`)
            setPlaylists(response.data)
            toast.success("Fetched successfully", { id: toastId });
        } catch (error) {
            console.error("Error getting playlists:", error);
            toast.error("Failed to getting playlists!", { id: toastId });
        }
    }
    useEffect(() => {
        if (user?._id)
            getAllPlaylists(user._id)
    }, [user?._id])
    const handleCreatePlaylist = async (e) => {
        e.preventDefault()
        const toastId = toast.loading("Creating...");

        try {
            const response = await API.post("/playlists/create", {
                name: playlistName,  // Ensure this matches backend schema
                description: playlistDescription,
            });

            toast.success("Playlist Created Successfully!", { id: toastId });

            // Optional: Reset state after creation
            setPlaylistName("");
            setPlaylistDescription("");
            setOpenCreatePlaylist(false)
            getAllPlaylists();
        } catch (error) {
            console.error("Error creating playlist:", error);
            toast.error("Failed to create playlist!", { id: toastId });
        }
    };

    return (
        <div className="mt-5 bg-gray-100 p-4 rounded-3xl">
            <button onClick={() => setOpenCreatePlaylist(true)} className="flex p-2 rounded-xl items-center space-x-2 bg-black text-white">
                <span>Create Playlist</span>
                <FaPlus className='text-white cursor-pointer dark:text-black' />
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5">
                {playlists.map((playlist) => (
                    <PlaylistCard key={playlist._id} playlist={playlist} />
                ))}
            </div>
            {openCreatePlaylist && <div className='absolute top-0 left-0 w-full h-full bg-black/20 backdrop-blur-md flex items-center justify-center'>
                <form onSubmit={(e) => handleCreatePlaylist(e)} className="relative bg-gradient-to-t from-white to-blue-50 border-4 border-white w-[500px] p-5 pt-9 rounded-3xl">
                    <InputType
                        extraClass="mb-5"
                        inputType="text"
                        placeholder="Add a name"
                        value={playlistName}
                        onChange={(e) => setPlaylistName(e)} // Ensure value change works
                    />

                    <textarea
                        value={playlistDescription}
                        onChange={(e) => setPlaylistDescription(e.target.value)}
                        placeholder="Add an optional description"
                        className="w-full placeholder:text-sm md:placeholder:text-base border-none pr-6 pl-8 py-3 rounded-2xl shadow-lg placeholder-gray-400 focus:outline focus:outline-2 outline-offset-2 resize-none"
                        rows={4}
                    />

                    <button
                        type="button"
                        onClick={() => setOpenCreatePlaylist(false)}
                        className="p-1 absolute top-2 right-2 rounded-full hover:bg-gray-200"
                    >
                        <LiaTimesSolid />
                    </button>

                    <button
                        type="submit"
                        className="mt-5 bg-black text-white font-medium px-6 py-3 rounded-2xl shadow-lg hover:bg-gray-900 transition-all duration-300"
                    >
                        Create
                    </button>
                </form>

            </div>}
        </div>
    );
};

export default Playlists;
