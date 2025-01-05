import React, { Suspense, useState, useEffect } from "react";
import apiService from "../services/apiService"; // Adjust the path according to your folder structure

// Lazy load the SongList component
const SongList = React.lazy(() => import("./SongList"));
import MusicPlayer from "./MusicPlayer";
import Header from "./Header";
import SongLoadingScalaton from "./SongLoadingScalaton";
import Upload from "./Upload";
import SongClickLoader from "./SongClickLoader";

function Layout() {
  const [songDetail, setSongDetail] = useState(null);
  const [songList, setSongList] = useState([]); // Initially set to an empty array
  const [player, setPlayer] = useState(0);
  const [hiddenPlayer, setHiddenPlayer] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [loading, setLoading] = useState(true); // To track loading state
  const [songClickLoading, setSongClickLoading] = useState(false); // To track loading state
  const [error, setError] = useState(""); // To track errors
  const [upload, setUpload] = useState(false);

  const handleToggleUpload = () => {
    setUpload(!upload);
  };

  // Fetch songs from the backend when the component mounts
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true); // Set loading to false when data is fetched
        const songs = await apiService.getSongs(); // Fetch songs from the backend
        setSongList(songs); // Set the song list from the API response
        setLoading(false); // Set loading to false when data is fetched
      } catch (err) {
        setError("Failed to fetch songs");
        setLoading(false);
      }
    };

    fetchSongs();
  }, []); // Empty dependency array means this runs once when the component mounts

  // Fetch song details whenever the player state changes
  useEffect(() => {
    const fetchSongDetails = async () => {
      if (player !== 0) {
        try {
          setSongClickLoading(true);
          const response = await apiService.getSongInfo(player);
          setSongDetail(response);
          setSongClickLoading(false);
        } catch (err) {
          console.error("Failed to fetch song details:", err);
          setSongClickLoading(false);
        }
      }
    };

    fetchSongDetails();
  }, [player]);

  // Filter songs based on search query (match song name or artist name)
  const filteredSongs = songList.filter(
    (song) =>
      song.songName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artistName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to handle song selection
  const handlePlayer = (songId) => {
    setPlayer(songId);
    setHiddenPlayer(false); // Show the player
  };

  // Function to close the player
  const handlePlayerClose = async (songId) => {
    try {
      await apiService.deleteThumbnails(songId);
      console.log(`Thumbnails for songId ${songId} deleted successfully.`);
      setHiddenPlayer(true); // Close the player
    } catch (error) {
      console.error("Error deleting thumbnails:", error.message);
    }
  };

  // Function to get the next song ID
  const getNextSongId = (currentSongId) => {
    const currentIndex = songList.findIndex(
      (song) => song.songId === currentSongId
    );

    if (currentIndex === -1) {
      console.error("Song not found in the list");
      return null;
    }

    const nextIndex = (currentIndex + 1) % songList.length;
    return songList[nextIndex].songId;
  };

  // Function to get the previous song ID
  const getPrevSongId = (currentSongId) => {
    const currentIndex = songList.findIndex(
      (song) => song.songId === currentSongId
    );
    if (currentIndex === -1) return null;

    const prevIndex = (currentIndex - 1 + songList.length) % songList.length;
    return songList[prevIndex].songId;
  };

  // Function to play the next song
  const playNextSong = () => {
    const nextSongId = getNextSongId(player);
    if (nextSongId) {
      setPlayer(nextSongId);
    }
  };

  // Function to play the previous song
  const playPrevSong = () => {
    const prevSongId = getPrevSongId(player);
    if (prevSongId) {
      setPlayer(prevSongId);
    }
  };

  if (loading) {
    return <SongLoadingScalaton />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="h-screen bg-fixed overflow-auto md:bg-[url(/bg.jpg)] bg-center bg-cover">
      <Header handleToggleUpload={handleToggleUpload} />
      <div className="flex flex-col md:p-10 w-full text-white overflow-auto">
        <div className="bg-white border p-4 pb-5 md:rounded-2xl">
          <div className="flex justify-between md:w-[500px]">
            <input
              type="text"
              className="md:w-[78%] w-full text-black border-2 rounded-xl py-4 px-3 outline-none"
              placeholder="Tell me what you want to listen to?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-5">
            <Suspense fallback={<SongLoadingScalaton />}>
              {filteredSongs.map((song) => (
                <SongList
                  key={song.songId}
                  handlePlayer={handlePlayer}
                  id={song.songId}
                  title={song.songName}
                  artist={song.artistName}
                />
              ))}
            </Suspense>
          </div>
        </div>
        {player !== 0 && songDetail && (
          <div className={`${hiddenPlayer ? "hidden" : "block"}`}>
            <MusicPlayer
              songId={player}
              handlePlayerClose={handlePlayerClose}
              songName={songDetail.songName}
              artistName={songDetail.artistName}
              image={songDetail.highQualityThumbnailUrl}
              audioUrl={songDetail.audioUrl}
              backgroundImage={songDetail.lowQualityThumbnailUrl}
              playNextSong={playNextSong}
              playPrevSong={playPrevSong}
            />
          </div>
        )}
        {upload && <Upload handleToggleUpload={handleToggleUpload} />}
        {/* {songClickLoading && <SongClickLoader />} */}
      </div>
    </div>
  );
}

export default Layout;
