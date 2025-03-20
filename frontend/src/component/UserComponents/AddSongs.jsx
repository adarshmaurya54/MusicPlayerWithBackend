
import React, { useEffect, useState } from "react";
import { API } from "../../services/apiService";
import { useParams } from "react-router-dom";
import { LiaTimesSolid } from "react-icons/lia";


const AddSongs = ({setOpenAddSong,getPlaylistDetails}) => {
    const [selectedSongs, setSelectedSongs] = useState([]);
    const [songs, setSongs] = useState([]);
    const { id } = useParams();

    // Handle option click
    const handleOptionClick = (option) => {
        if (selectedSongs.includes(option)) {
            // Remove if already selected
            setSelectedSongs(selectedSongs.filter((item) => item !== option));
        } else {
            // Add to array if not selected
            setSelectedSongs([...selectedSongs, option]);
        }
    };
    const loadSongs = async () => {
        try {
            const response = await API.get("/songs/?favourite=false&artist=all")
            setSongs(response.data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        loadSongs()
    }, [])

    const handleAddSongs = async () => {
        try {
            const response = await API.post("/playlists/addSongs", {
                songs: selectedSongs, // Array of song IDs
                playlistId: id,       // Playlist ID
            });

            if (response.status === 200) {
                getPlaylistDetails()
                setOpenAddSong(false)
            }
        } catch (error) {
            console.error("Error adding songs:", error);
        }
    };


    return (
        <div className='fixed top-0 left-0 w-full h-full bg-black/20 backdrop-blur-md flex items-center justify-center'>
            <div className="relative bg-gradient-to-t from-white to-blue-50 border-4 border-white w-[90%] h-[90%] p-5 pt-9 rounded-3xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 h-[90%] no-scrollbar rounded-xl overflow-auto">
                    {songs.map((option) => (
                        <div
                            key={option._id}
                            onClick={() => handleOptionClick(option._id)}
                            className={`flex cursor-pointer  justify-between px-4 hover:shadow-md transition-all duration-500 py-2 rounded-xl text-sm ${selectedSongs.includes(option._id)
                                ? "bg-blue-500 text-white"
                                : "bg-white text-gray-700 hover:bg-blue-100"
                                }`}
                        >
                            <div className="flex items-center justify-center">
                                <div className={`flex p-[2px] items-center justify-center w-5 h-5 border ${selectedSongs.includes(option._id) ? "border-white" : "border-black/20"} rounded-full`}>
                                    <div className={`w-full h-full rounded-full ${selectedSongs.includes(option._id) ? "bg-white" : ""}`}></div>
                                </div>
                            </div>
                            <div className="flex w-[87%] flex-col justify-center">
                                <span className="">{option.songName}</span>
                                <span className={`text-xs ${selectedSongs.includes(option._id) ? "text-gray-200" : "text-gray-400"}`}>{option.artistName}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={() => handleAddSongs()} disabled={selectedSongs.length === 0} className="bg-black mt-4 py-2 px-4 rounded-xl text-white">Add {selectedSongs.length === 0 ? "" : selectedSongs.length} {selectedSongs.length <= 1 ? "Song" : "Songs"}</button>
                <button
                    type="button"
                    onClick={() => setOpenAddSong(false)}
                    className="p-1 absolute top-2 right-2 rounded-full hover:bg-gray-200"
                >
                    <LiaTimesSolid />
                </button>
            </div>
        </div>
    );
};

export default AddSongs;
