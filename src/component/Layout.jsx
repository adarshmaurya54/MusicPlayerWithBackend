import React, { Suspense, useState } from "react";
import { CiSearch } from "react-icons/ci";

// Lazy load the SongList component
const SongList = React.lazy(() => import("./SongList"));
import songs from "../assets/jsonFiles/songs.json"; // Import songs.json
import MusicPlayer from "./MusicPlayer";

function Layout() {
  const [songList, setSongList] = useState(songs); // Set songs directly
  const [player, setPlayer] = useState(0);
  const [hiddenPlayer, setHiddenPlayer] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  // Function to handle song selection
  const handlePlayer = (songId) => {
    setPlayer(songId); // Set the player to the song ID selected
    setHiddenPlayer(false); // Open the player
  };

  // Function to close the player
  const handlePlayerClose = () => {
    setHiddenPlayer(true); // Close the player
  };

  // Filter songs based on search query (match song name or artist name)
  const filteredSongs = songList.filter(
    (song) =>
      song.songName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artistName.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const selectedSong = songList.find((song) => song.id === player);

  return (
    <div
      className="h-screen bg-center bg-cover"
      style={{ backgroundImage: `url(/assets/bg.jpg)` }}
    >
      <div className="absolute flex flex-col md:p-10 p-3 top-0 left-0 w-full h-full bg-black/30 text-white overflow-auto">
        <div className="flex justify-between md:w-[500px]">
          <input
            type="text"
            className="md:w-[78%] w-full text-black bg-white rounded-xl text-sm p-2 px-3 outline-none font-light"
            placeholder="Tell me what you want to listen to?"
            value={searchQuery} // Bind the input value to searchQuery
            onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery on input change
          />
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mt-5">
          {/* Suspense wrapper for lazy loading */}
          <Suspense fallback={<div>Loading songs...</div>}>
            {filteredSongs.map((song) => (
              <SongList
                key={song.id}
                handlePlayer={handlePlayer}
                id={song.id}
                title={song.songName}
                artist={song.artistName}
              />
            ))}
          </Suspense>
        </div>

        {player !== 0 && selectedSong && (
          <div className={`${hiddenPlayer ? "hidden" : "block"}`}>
            <MusicPlayer
              songId={selectedSong.id}
              handlePlayerClose={handlePlayerClose}
              songName={selectedSong.songName}
              artistName={selectedSong.artistName}
              image={selectedSong.poster}
              totalDuration={400} // Assuming the song duration is in seconds
              playNextSong={playNextSong}
              playPrevSong={playPrevSong}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Layout;
