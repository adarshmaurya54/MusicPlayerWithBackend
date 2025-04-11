import React, { useEffect, useState } from 'react'
import { API } from '../../services/apiService';
import toast from 'react-hot-toast';
import { useOutletContext } from 'react-router-dom';
import SongList from '../SongList';

function LikedSongs() {
    const [likedSongs, setLikedSongs] = useState([]);
    const [loading, setLoading] = useState(false);
    const { songDetail, player, setPlayer, setSongList, isPlaying } = useOutletContext();

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

    if (loading) {
        return <div className="mt-4 text-center text-xl">Please Wait...</div>;
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
