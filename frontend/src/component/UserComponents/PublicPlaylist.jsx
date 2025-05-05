import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import AddSongs from "./AddSongs";
import { API } from "../../services/apiService";
import { MdOutlinePlaylistRemove, MdPlaylistAdd } from "react-icons/md";
import { LiaTimesSolid } from "react-icons/lia";
import InputType from "../auth/InputType";
import toast from "react-hot-toast";
import SongList from "../SongList";
import { GoArrowLeft } from "react-icons/go";
import Share from "../Share";
import { TiWarning } from "react-icons/ti";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "../../redux/features/auth/authAction";


function PublicPlaylist() {
    const [openPlaylistShare, setOpenPlaylistShare] = useState(false);
    const [playlist, setPlaylist] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const { player, setPlayer, songDetail, setSongList, isPlaying } = useOutletContext();

    // Fetch playlist details
    const getPlaylistDetails = async () => {
        try {
            const response = await API.get(`/playlists/publicPlaylist/${id}`);
            setPlaylist(response.data);
        } catch (error) {
            setPlaylist([])
            console.error("Error fetching playlist details:", error);
            if (error.response && error.response.data && error.response.data.error) {
                toast.error(error.response.data.error); // Show backend error message
            } else {
                toast.error("Something went wrong while fetching playlist details.");
            }
        }
    };
    //getting the currently loggedin user
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getCurrentUser()); // Dispatch action directly
        // navigate('/library/liked-songs')
    }, [dispatch]);
    useEffect(() => {
        getPlaylistDetails();
    }, []);

    if (!playlist) {
        return <div className="w-full px-4 py-8 mt-5 rounded-2xl flex items-center justify-center">
            <div className="flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 border-4 border-white border-dashed rounded-full animate-spin"></div>
                    <p className="text-xl text-center font-semibold text-gray-300">
                        Loading...
                    </p>
                </div>
            </div>
        </div>
    }

    return (
        <div className={`relative my-5 p-5 md:bg-white md:dark:bg-transparent rounded-3xl w-full`}>
            {!playlist.public && (
                <div className="p-4 flex flex-col items-center justify-center my-4 rounded-3xl md:text-black dark:text-white text-white">
                    <h2 className="text-3xl flex flex-col items-center justify-center gap-3 font-bold mb-2"><TiWarning className="text-7xl" />This playlist is private</h2>
                    <p className="mb-3 text-center">You don't have access to view the songs in this playlist.</p>
                    <button
                        className="bg-white border-2 border-[#8251c5] mt-5 w-[300px] rounded-2xl h-14 relative text-xl font-semibold text-black overflow-hidden group"
                        type="button"
                        onClick={() => navigate('/')}
                    >
                        <div className="absolute group left-[2px] top-[2px] h-[calc(100%-4px)] w-[calc(25%-4px)] bg-gradient-to-r from-[#8251c5] to-[#5c3ab5] text-white rounded-xl flex items-center justify-center z-10 group-hover:w-[calc(100%-4px)] duration-500 ease-in-out">
                            <GoArrowLeft className="group-hover:opacity-0 opacity-100" />
                        </div>
                        <span className="relative z-20 ml-10 group-hover:ml-0 transition-all duration-500 text-black group-hover:text-white">
                            Go Back
                        </span>
                    </button>
                </div>
            )}
            {playlist.public && (
                <>
                    <div className="flex mb-3 items-center justify-between">
                        <div className="flex items-center gap-2">
                            <img
                                title={playlist.user_id.name}
                                src={`${import.meta.env.VITE_BASEURL}/assets/users/${playlist.user_id.profilePic}`}
                                alt={playlist.user_id.name}
                                className="border border-gray-200 dark:border-white/20 w-8 h-8 object-cover rounded-full"
                            />
                            <div className="text-sm dark:text-white md:text-black text-white">
                                <span className="font-semibold">Created by</span>{" "}
                                <span className="font-bold">{playlist.user_id.name}</span>
                                <span className="text-gray-400 font-normal">
                                    {" "}• {playlist?.songs?.length || 0}{" "}
                                    {playlist?.songs?.length === 1 ? "song" : "songs"}
                                </span>
                            </div>
                        </div>
                    </div>


                    <div className="flex md:p-0 p-3 flex-col md:bg-transparent bg-white dark:bg-transparent border rounded-3xl gap-4 md:pb-4 md:border-b dark:border-white/20 md:border-x-0 md:border-t-0 md:rounded-none">
                        <div className="flex dark:text-white md:items-center justify-between">
                            <div>
                                <h1 className="text-2xl md:text-5xl mb-2 font-bold">{playlist?.name}</h1>
                                <p className="md:text-sm text-xs mt-1 text-gray-500 dark:text-gray-400">{playlist?.description || "No description available"}</p>
                            </div>
                        </div>
                    </div>

                    {/* ✅ Song List */}
                    <div className="mt-6">
                        {playlist?.songs?.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10">
                                <p className="text-gray-500 font-semibold">No songs available in this playlist.</p>
                            </div>
                        ) : (
                            <div className="mt-2 grid gap-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-5">
                                    {playlist.songs?.map((song, index) => (
                                        <SongList
                                            currentlyPlaying={player === song.audioFile}
                                            isPlaying={isPlaying}
                                            key={song.songId}
                                            handlePlayer={() => { setPlayer(song.audioFile); setSongList(playlist.songs) }}
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
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    {openPlaylistShare && <Share setShare={setOpenPlaylistShare} url={`${import.meta.env.VITE_FRONTEND_URL}/playlist/${playlist._id}`} heading='Share public link to playlist' description='Your playlist link is ready to share. Copy the link and send it to your friends!' />}
                </>
            )}

        </div>
    );
}

export default PublicPlaylist;
