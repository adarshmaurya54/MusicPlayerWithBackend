import React, { useEffect, useState } from 'react'
import { API } from '../../services/apiService';
import { useNavigate, useOutletContext } from 'react-router-dom';
import SongList from '../../component/SongList';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from '../../redux/features/auth/authAction';
import toast from 'react-hot-toast';

function LikedSongs() {
    const { error } = useSelector((state) => state.auth);
    const [likedSongs, setLikedSongs] = useState([]);
    const [loading, setLoading] = useState(false);
    const { songDetail, player, setPlayer, setSongList, isPlaying } = useOutletContext();
    const navigate = useNavigate()
    // Fetch liked songs
    const getLikedSongs = async () => {
        setLoading(true);
        try {
            const response = await API.get(`/songs/liked-songs/`);
            setLikedSongs(response.data || []); // Set empty array if no data
        } catch (error) {
            console.log("Error fetching liked songs:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        getLikedSongs();
    }, []);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getCurrentUser()); // Dispatch action directly
        // navigate('/library/liked-songs')
    }, []);

    if (error) {
        navigate("/")
    }
    if (loading) {
        return <div className="w-full px-4 py-8 mt-5 rounded-2xl flex items-center justify-center bg-white">
            <div className="flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 border-4 border-black/50 border-dashed rounded-full animate-spin"></div>
                    <p className="text-xl text-center font-semibold text-gray-700">
                        Loading...
                    </p>
                </div>
            </div>
        </div>
    }

    return (
        <div>
            {likedSongs.length === 0 ? (
                <div className="mt-4 text-center text-lg text-gray-500">
                    No liked songs found.
                </div>
            ) : (
                <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-5`}>
                    {likedSongs.map((song, index) => (
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
            )}
        </div>
    );
}

export default LikedSongs;
