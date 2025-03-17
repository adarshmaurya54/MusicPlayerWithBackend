import React, { useEffect, useState } from 'react'
import defaultUser from "../../assets/default-user.jpg"
import { FaPlay } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import InputType from '../auth/InputType';
import { LiaTimesSolid } from 'react-icons/lia';
import toast from 'react-hot-toast';
import { API } from '../../services/apiService';



function Library() {
    const [selectedBtn, setSelectedBtn] = useState('playlists')
    const [gradient, setGradient] = useState("");
    const [openCreatePlaylist, setOpenCreatePlaylist] = useState(false)
    const [playlistName, setPlaylistName] = useState('')
    const [playlistDescription, setPlaylistDescription] = useState('')

    useEffect(() => {
        const randomGradient = generateRandomGradient();
        setGradient(randomGradient);
    }, []);

    function generateRandomGradient() {
        const color1 = getPastelColor();
        const color2 = getPastelColor();
        return `linear-gradient(135deg, ${color1}, ${color2})`;
    }

    function getPastelColor() {
        const r = Math.floor(150 + Math.random() * 100); // 150-250 (Avoid dark)
        const g = Math.floor(150 + Math.random() * 100); // 150-250
        const b = Math.floor(150 + Math.random() * 100); // 150-250
        return `rgb(${r}, ${g}, ${b})`;
    }

    const handleCreatePlaylist = async () => {
        const toastId = toast.loading("Creating...");
        
        try {
            const response = await API.post("/playlist/create", {
                name: playlistName,  // Ensure this matches backend schema
                description: playlistDescription,
            });
    
            toast.success("Playlist Created Successfully!", { id: toastId });
            
            // Optional: Reset state after creation
            setPlaylistName("");
            setPlaylistDescription("");
            setOpenCreatePlaylist(false)
    
        } catch (error) {
            console.error("Error creating playlist:", error);
            toast.error("Failed to create playlist!", { id: toastId });
        }
    };
    

    return (
        <div className="md:bg-white my-5 py-12 px-8 dark:md:bg-slate-900/50 dark:border-white/10 md:border md:rounded-3xl">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-5">
                    <img
                        src={defaultUser} // Replace with actual image URL
                        alt="Profile"
                        className="md:w-14 border border-gray-100 md:h-14 w-7 h-7 object-cover rounded-full"
                    />
                    <p className='text-2xl dark:text-gray-50 font-bold'>Your Library</p>
                </div>
                <div className="flex items-center space-x-5">
                    <FaPlus onClick={() => setOpenCreatePlaylist(true)} title='Create new playlist' className='text-black cursor-pointer dark:text-white text-3xl' />
                </div>
            </div>
            <div className='flex items-center space-x-2 mt-5'>
                <button onClick={() => setSelectedBtn("playlists")} className={`${selectedBtn !== 'playlists' ? "text-black dark:text-gray-50 hover:text-white hover:bg-black hover:dark:bg-white hover:dark:text-black" : "dark:bg-white bg-black text-white dark:text-black"} border dark:border-white/20 text-xs py-2 px-3 rounded-full`}>
                    Playlists
                </button>
                <button onClick={() => setSelectedBtn("liked-songs")} className={`${selectedBtn !== 'liked-songs' ? "text-black dark:text-gray-50 hover:text-white hover:bg-black hover:dark:bg-white hover:dark:text-black" : "dark:bg-white bg-black text-white dark:text-black"} border dark:border-white/20 text-xs py-2 px-3 rounded-full`}>
                    Liked Songs
                </button>
            </div>
            {/* Playlist component */}
            <div className="flex gap-3 mt-5 items-center">
                <div
                    className="w-[120px] group overflow-hidden h-[120px] relative rounded-3xl transition-all duration-500"
                    style={{ background: gradient }}
                >
                    <div className="bg-black/20 absolute top-0 left-0 w-full h-full"></div>
                    <img
                        src={import.meta.env.VITE_BASEURL + "/assets/thumbnails/default-thumbnail-low.png"} // Replace with actual image URL
                        alt="Profile"
                        className="w-4 h-4 absolute top-2 left-2 object-cover rounded-full"
                    />
                    <p className='absolute bottom-3 left-2 font-bold text-white'>Playlist One</p>
                    <div
                        className="absolute cursor-pointer flex items-center justify-center bottom-1 group-hover:opacity-100 opacity-0 group-hover:bottom-2 transition-all duration-300 right-2 w-10 h-10 rounded-full"
                        style={{
                            background: "linear-gradient(180deg, #8653C7, #6942BB, #5C3AB5)",
                        }}
                    >
                        <FaPlay className='text-white' />
                    </div>
                </div>
            </div>
            {openCreatePlaylist && <div className='absolute top-0 left-0 w-full h-full bg-black/20 backdrop-blur-md flex items-center justify-center'>
                <div className="relative bg-gradient-to-t from-white to-blue-50 border-4 border-white w-[500px] p-5 pt-9 rounded-3xl">
                    <InputType
                        extraClass='mb-5'
                        inputType="text"
                        placeholder="Add a name"
                        value={playlistName}
                        onChange={(e) => setPlaylistName(e)} />

                    <textarea
                        value={playlistDescription}
                        onChange={(e) => { setPlaylistDescription(e.target.value); }}
                        placeholder='Add an optional description'
                        className={`w-full placeholder:text-sm md:placeholder:text-base border-none pr-6 pl-8 py-3 rounded-2xl shadow-lg placeholder-gray-400 focus:outline focus:outline-2 outline-offset-2 resize-none`}
                        rows={4} // Default rows, can be overridden
                    />
                    <button onClick={() => setOpenCreatePlaylist(false)} className="p-1 absolute top-2 right-2 rounded-full hover:bg-gray-200">
                        <LiaTimesSolid />
                    </button>
                    <button
                        onClick={handleCreatePlaylist}
                        className="mt-5 bg-black text-white font-medium px-6 py-3 rounded-2xl shadow-lg hover:bg-gray-900 transition-all duration-300"
                    >
                        Create
                    </button>

                </div>
            </div>}
        </div>
    )
}

export default Library
