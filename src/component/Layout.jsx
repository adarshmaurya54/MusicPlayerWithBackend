import React, { Suspense, useState } from "react";
import { CiSearch } from "react-icons/ci";

// Lazy load the SongList component
const SongList = React.lazy(() => import("./SongList"));
import songs from "../assets/jsonFiles/songs.json"; // Import songs.json
import MusicPlayer from "./MusicPlayer";

function Layout() {
  const [songList, setSongList] = useState(songs); // Set songs directly
  const [player, setPlayer] = useState(0);

  // Function to handle song selection
  const handlePlayer = (songId) => {
    setPlayer(songId);  // Set the player to the song ID selected
  };

  // Function to close the player
  const handlePlayerClose = () => {
    setPlayer(0);  // Close the player
  };

  // Function to get the next song ID
  const getNextSongId = (currentSongId) => {
    const currentIndex = songList.findIndex((song) => song.id === currentSongId);
    if (currentIndex === -1) return null; // If song is not found, return null

    // Get the next song index (looping back to the first song when at the end)
    const nextIndex = (currentIndex + 1) % songList.length;
    return songList[nextIndex].id; // Return the next song's ID
  };

  // Function to get the previous song ID
  const getPrevSongId = (currentSongId) => {
    const currentIndex = songList.findIndex((song) => song.id === currentSongId);
    if (currentIndex === -1) return null; // If song is not found, return null

    // Get the previous song index (looping back to the last song when at the beginning)
    const prevIndex = (currentIndex - 1 + songList.length) % songList.length;
    return songList[prevIndex].id; // Return the previous song's ID
  };

  // Function to play the next song
  const playNextSong = () => {
    const nextSongId = getNextSongId(player);
    if (nextSongId) {
      setPlayer(nextSongId);  // Update the player with the next song ID
    }
  };

  // Function to play the previous song
  const playPrevSong = () => {
    const prevSongId = getPrevSongId(player);
    if (prevSongId) {
      setPlayer(prevSongId);  // Update the player with the previous song ID
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
            className="w-[78%] text-white bg-white/30 rounded-full text-sm p-2 px-3 outline-none font-light"
            placeholder="Tell me what you want to listen to?"
          />
          <button
            type="button"
            className="bg-white/30 text-sm text-white w-[20%] rounded-full flex justify-center items-center"
          >
            <CiSearch className="inline-block me-1" />
          </button>
        </div>

        <div className="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2 gap-4 mt-5">
          {/* Suspense wrapper for lazy loading */}
          <Suspense fallback={<div>Loading songs...</div>}>
            {songList.map((song) => (
              <SongList
                key={song.id}
                handlePlayer={handlePlayer} // Pass the function reference
                id={song.id}
                title={song.songName}
                artist={song.artistName}
                poster={song.poster}
              />
            ))}
          </Suspense>
        </div>

        {player !== 0 && selectedSong && (
          <MusicPlayer
            songId={selectedSong.id}
            handlePlayerClose={handlePlayerClose}
            songName={selectedSong.songName}
            artistName={selectedSong.artistName}
            image={selectedSong.poster}
            totalDuration={400} // Assuming the song duration is in seconds
            playNextSong={playNextSong} // Pass the function to the music player
            playPrevSong={playPrevSong} // Pass the previous song function to the music player
          />
        )}
      </div>
    </div>
  );
}

export default Layout;
