import React, { Suspense, useState, useEffect } from "react";
import apiService from "../services/apiService"; // Adjust the path according to your folder structure

// Lazy load the SongList component
const SongList = React.lazy(() => import("./SongList"));
import MusicPlayer from "./MusicPlayer";
import Header from "./Header";
import SongLoadingScalaton from "./SongLoadingScalaton";
import Upload from "./Upload";

function Layout() {
  const [songDetail, setSongDetail] = useState(null);
  const [songList, setSongList] = useState([]); // Initially set to an empty array
  const [player, setPlayer] = useState(0);
  const [hiddenPlayer, setHiddenPlayer] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [loading, setLoading] = useState(true); // To track loading state
  const [error, setError] = useState(""); // To track errors
  const [upload, setUpload] = useState(false);
  
  const handleToggleUpload = () => {
    setUpload(!upload);
  }

  // Fetch songs from the backend when the component mounts
  useEffect(() => {
    const fetchSongs = async () => {
      try {
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

  // Filter songs based on search query (match song name or artist name)
  const filteredSongs = songList.filter(
    (song) =>
      song.songName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artistName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to handle song selection
  const handlePlayer = async (songId) => {
    try {
      // setLoading(true); // Start loading
      const response = await apiService.getSongInfo(songId); // Fetch song details using songId
      setSongDetail(response); // Update song details with the response data
      // setLoading(false); // Stop loading
    } catch (err) {
      console.log(err);
      // setLoading(false); // Stop loading in case of error
    }
    setPlayer(songId); // Set the player to the song ID selected
    setHiddenPlayer(false); // Open the player
  };
  
  // Function to close the player
  const handlePlayerClose = () => {
    setHiddenPlayer(true); // Close the player
  };

  // Function to get the next song ID
  const getNextSongId = (currentSongId) => {
    const currentIndex = songList.findIndex(
      (song) => song.id === currentSongId
    );
    if (currentIndex === -1) return null;

    const nextIndex = (currentIndex + 1) % songList.length;
    return songList[nextIndex].id;
  };

  // Function to get the previous song ID
  const getPrevSongId = (currentSongId) => {
    const currentIndex = songList.findIndex(
      (song) => song.id === currentSongId
    );
    if (currentIndex === -1) return null;

    const prevIndex = (currentIndex - 1 + songList.length) % songList.length;
    return songList[prevIndex].id;
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

  const selectedSong = songList.find((song) => song.songId === player);

  if (loading) {
    return <SongLoadingScalaton/>;
  }

  if (error) {
    return <div>{error}</div>;
  }
 console.log(songDetail);
 
  return (
    <div className="h-screen bg-fixed overflow-auto md:bg-[url(/assets/bg.jpg)] bg-center bg-cover">
      <Header handleToggleUpload={handleToggleUpload}/>
      <div className="flex flex-col md:p-10 w-full text-white overflow-auto">
        <div className="bg-white border p-4 pb-5 md:rounded-2xl">
          <div className="flex justify-between md:w-[500px]">
            <input
              type="text"
              className="md:w-[78%] w-full text-black border-2 rounded-xl py-4 px-3 outline-none"
              placeholder="Tell me what you want to listen to?"
              value={searchQuery} // Bind the input value to searchQuery
              onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery on input change
            />
          </div>
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-5">
            <Suspense fallback={<SongLoadingScalaton/>}>
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
        {player !== 0 && selectedSong && (
          <div className={`${hiddenPlayer ? "hidden" : "block"}`}>
            <MusicPlayer
              songId={selectedSong.songId}
              handlePlayerClose={handlePlayerClose}
              songName={selectedSong.songName}
              artistName={songDetail?.artistName}
              image={songDetail?.highQualityThumbnailUrl}
              backgroundImage={songDetail?.lowQualityThumbnailUrl}
              playNextSong={playNextSong}
              playPrevSong={playPrevSong}
            />
          </div>
        )}
        {upload && <Upload handleToggleUpload={handleToggleUpload}/>}
      </div>
    </div>
  );
}

export default Layout;
