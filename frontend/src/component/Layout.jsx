import React, { Suspense, useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom"; // useParams for URL parameters and useNavigate for navigation
import apiService from "../services/apiService";

// Lazy load the SongList component
const SongList = React.lazy(() => import("./SongList"));
import MusicPlayer from "./MusicPlayer";
import Header from "./Header";
import SongLoadingScalaton from "./SongLoadingScalaton";
import Upload from "./Upload";
import axios from "axios";
import EditSong from "./EditSong";
import Pagination from "./Pagination";
import bg from "../assets/bg.jpg";
import iconImage from '../../public/icon.png'
import ArtistButtons from "./ArtistButtons";
import {
  TbPlayerTrackNextFilled,
  TbPlayerTrackPrevFilled,
} from "react-icons/tb";
import { LiaTimesSolid } from "react-icons/lia";

function Layout() {
  const { songId } = useParams(); // Get songId from URL
  const [songDetail, setSongDetail] = useState(null);
  const [selectedArtist, setSelectedArtist] = useState("all");
  const [songLoop, setSongLoop] = useState(false);
  const [songList, setSongList] = useState([]);
  const [songListCopy, setSongListCopy] = useState([]);
  const [hiddenPlayer, setHiddenPlayer] = useState(true); // Manage visibility
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [upload, setUpload] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editSongId, setEditSongId] = useState("");
  const [player, setPlayer] = useState(songId ? songId : 0); // To handle current song
  const [songClickLoading, setSongClickLoading] = useState(false);
  const [isNoSongsFound, setIsNoSongsFound] = useState(false);
  const [currentPlayingSong, setCurrentPlayingSong] = useState({
    id: 0,
    name: "",
    artist: "",
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track if user is authenticated
  const [currentPage, setCurrentPage] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // if song is loading in music player
  const audioRef = useRef(null);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [isFavourite, setIsFavourite] = useState(false);

  const togglePlayPause = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const itemsPerPage = 9; // Number of songs per page
  //pagination logic
  // Filtered songs based on search query
  const filteredSongs = songList.filter(
    (song) =>
      song.songName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artistName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Total pages based on the filtered list
  const totalPages = Math.ceil(filteredSongs.length / itemsPerPage);

  // Calculate page numbers to display
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Function to handle next page logic
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Function to handle previous page logic
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Calculate which page numbers to show (pagination range)
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSongs = filteredSongs.slice(startIndex, endIndex);

  // Function to handle direct page click
  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Update current page based on filtered search results
  useEffect(() => {
    // Reset to the first page if the search query changes
    setCurrentPage(1);
  }, [searchQuery]);
  //pagination logic ended

  const navigate = useNavigate();

  // authentication code to check whether admin is login or not
  // Get the base URL from the environment variables
  const baseUrl = import.meta.env.VITE_BASEURL; // This will use the VITE_BASE_URL variable from .env

  // Check if the token is valid
  const checkTokenValidity = async (token) => {
    try {
      // Make a request using Axios
      const response = await axios.post(
        `${baseUrl}/validate-token`, // Use the base URL with the validate-token endpoint
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        localStorage.removeItem("token"); // Remove invalid token
      }
    } catch (error) {
      console.error("Error validating token:", error);
      setIsAuthenticated(false);
      localStorage.removeItem("token"); // Handle error and remove token
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      checkTokenValidity(token); // Check token validity on component mount
    } else {
      setIsAuthenticated(false); // No token means user is not authenticated
    }
  }, []); // Empty dependency array to run once on mount
  // authentication code to check whether admin is login or not

  const handleToggleUpload = () => {
    setUpload(!upload);
  };
  const handleToggleEdit = (songId = "") => {
    setEdit(!edit);
    setEditSongId(songId);
  };

  const fetchSongs = async () => {
    try {
      setCurrentPage(1);
      setLoading(true);
      const songs = await apiService.getSongs(isFavourite, selectedArtist);
      if (songs.length === 0) {
        setIsNoSongsFound(true); // Set state to true if no songs are found
      } else {
        setIsNoSongsFound(false); // Set state to false if songs are found
      }

      setSongList(songs); // If no songs, songs will be an empty array
      setSongListCopy(songs); // If no songs, songs will be an empty array
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch songs");
      setSongList([]); // Ensure the song list is cleared in case of error
      setIsNoSongsFound(false); // In case of error, assume songs are available
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, [selectedArtist]);
  useEffect(() => {
    if (isFavourite) {
      // Filter the songs to include only those with favourite = true
      setSongList(songListCopy.filter((song) => song.favourite));
    } else {
      // Reset to the original song list
      setSongList([...songListCopy]);
    }
  }, [isFavourite]);

  // Fetch song details based on songId from URL
  useEffect(() => {
    const resetPlayerState = () => {
      setSongDetail(null);
      setCurrentPlayingSong({
        id: 0,
        name: "",
        artist: "",
      });
    };
    const fetchSongDetails = async () => {
      setSongClickLoading(true); // Start loading
      try {
        const response = await apiService.getSongInfo(songId);
        setSongDetail(response);
        // setHiddenPlayer(false); // Make the player visible
      } catch (err) {
        console.error("Failed to fetch song details:", err);
        navigate("/no-song-found"); // Redirect on error
      } finally {
        setSongClickLoading(false); // Stop loading
      }
    };

    // Reset state and delete thumbnails
    resetPlayerState();

    // Fetch song details if `songId` exists
    if (songId) {
      fetchSongDetails();
    }
  }, [songId]);
  useEffect(() => {
    // If no songId is provided, redirect to the main URL
    if (!songId) {
      navigate("/"); // Redirect to the main page
    }
  }, [songId, navigate]);

  // Handle song click to navigate and set player state
  const handlePlayer = async (id, title, artist) => {
    if (player !== 0) {
      await apiService.deleteThumbnails(player);
    }
    setCurrentPlayingSong({
      id,
      name: title,
      artist,
    });
    setPlayer(id);
    navigate(`/song/${id}`);
  };

  useEffect(() => {
    setCurrentPlayingSong({
      id: songDetail?.audioUrl,
      name: songDetail?.songName,
      artist: songDetail?.artistName,
    });
    setTimeout(async () => {
      if (player !== 0) {
        await apiService.deleteThumbnails(player);
      }
    }, 10000);
  }, [songDetail]);

  // Play the next song
  const playNextSong = () => {
    const nextSongId = getNextSongId(player);
    if (nextSongId) {
      setPlayer(nextSongId);
      navigate(`/song/${nextSongId}`);
    }
  };

  // Play the previous song
  const playPrevSong = async () => {
    const prevSongId = getPrevSongId(player);
    if (prevSongId) {
      setPlayer(prevSongId);
      navigate(`/song/${prevSongId}`);
    }
  };

  // Get the next song ID
  const getNextSongId = (currentSongId) => {
    const currentIndex = songList.findIndex(
      (song) => song.audioFile === currentSongId
    );
    if (currentIndex === -1) return null;

    const nextIndex = (currentIndex + 1) % songList.length;
    return songList[nextIndex].audioFile;
  };

  // Get the previous song ID
  const getPrevSongId = (currentSongId) => {
    const currentIndex = songList.findIndex(
      (song) => song.audioFile === currentSongId
    );
    if (currentIndex === -1) return null;

    const prevIndex = (currentIndex - 1 + songList.length) % songList.length;
    return songList[prevIndex].audioFile;
  };

  // Function to close the player
  const handlePlayerClose = async (id, name, artist) => {
    setCurrentPlayingSong({
      id,
      name,
      artist,
    });
    setHiddenPlayer(true);
  };
  useEffect(()=> {
    const link = document.getElementsByTagName('link')[0];
    const title = document.getElementsByTagName('title')[0];
    link.href = songDetail?.highQualityThumbnailUrl ? `${import.meta.env.VITE_BASEURL}/assets` + songDetail?.highQualityThumbnailUrl : iconImage;
    title.innerText = songDetail?.songName ? songDetail?.songName + " • " + songDetail?.artistName : "PlayMusic";
    
  }, [songDetail?.highQualityThumbnailUrl])

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <div
        className="h-screen bg-fixed overflow-auto bg-center bg-cover"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <Header handleToggleUpload={handleToggleUpload} />
        <div className="flex flex-col md:px-10 mb-5 w-full text-white">
          <div className="md:bg-white md:border p-4 pb-5 md:rounded-3xl">
            {!isNoSongsFound && (
              <>
                <div className="flex gap-5 md:flex-row flex-col items-center w-full text-black justify-between">
                  <div className="relative md:w-[376px] w-full">
                    {/* Search Icon */}
                    <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none ">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                        />
                      </svg>
                    </span>

                    {/* Input Field */}
                    <input
                      type="text"
                      className="w-full text-black border rounded-xl py-4 pl-12 pr-5 outline-none
                            bg-white md:focus:ring-1 focus:ring-offset-2 focus:ring-gray-500 focus:ring-opacity-50
                            transition-all duration-300 ease-in-out placeholder:text-sm"
                      placeholder="Search for music that matches your vibe"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  {songId && (
                    <div className="relative group w-full md:w-auto">
                      <div
                        onClick={() => navigate("/")}
                        className="opacity-0 group-hover:opacity-100  transition-opacity duration-300 absolute -top-2 text-xs right-[2px] cursor-pointer border rounded-full p-[2px] text-gray-500 bg-white z-10"
                      >
                        <LiaTimesSolid />
                      </div>
                      <div
                        className="w-full group flex items-center overflow-hidden rounded-xl md:w-[330px]"
                        style={{
                          backgroundImage: songDetail
                            ? `url(${import.meta.env.VITE_BASEURL}/assets${
                                songDetail?.lowQualityThumbnailUrl
                              })`
                            : "url(/player.png)", // Fallback to player.png if songDetail is not available
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      >
                        <div className="flex bg-black/25 w-full items-center justify-between backdrop-blur-md ">
                          <div className="flex w-full ps-2 pe-5 py-2 items-center gap-3">
                            <img
                              onClick={() =>
                                setHiddenPlayer((prevState) => !prevState)
                              } // Toggle visibility
                              src={
                                songDetail
                                  ? `${import.meta.env.VITE_BASEURL}/assets${
                                      songDetail?.lowQualityThumbnailUrl
                                    }`
                                  : "/player.png"
                              }
                              alt="player.png"
                              className={`w-14 h-14 rounded-full cursor-pointer object-cover ${
                                isPlaying ? "animate-spin-slow" : "" // Spin only when isPlaying is true
                              }`}
                            />
                            <div className="flex flex-col w-full">
                              <p className="font-bold text-xl text-white">
                                {currentPlayingSong?.name
                                  ? isLoading
                                    ? "Buffering..."
                                    : isPlaying
                                    ? "Now Playing"
                                    : "Paused"
                                  : "Please wait"}
                              </p>
                              {currentPlayingSong?.name ? (
                                <marquee
                                  className="text-xs text-gray-200"
                                  behavior=""
                                  scrollamount="2"
                                >
                                  {isPlaying
                                    ? `${currentPlayingSong.name} • ${currentPlayingSong.artist}`
                                    : isLoading
                                    ? "Your song is loading please wait..."
                                    : "Click play to start the music!"}
                                </marquee>
                              ) : (
                                <div className="text-xs text-gray-200">
                                  Loading you next song...
                                </div>
                              )}
                              <div className="relative w-full mt-3 bg-white/20 rounded-full h-1">
                                <div
                                  className="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-300 ease-out"
                                  style={{ width: `${progressPercentage}%` }}
                                ></div>
                                <div
                                  className="absolute transition-all duration-700 top-1/2 transform -translate-y-1/2 bg-white w-3 h-3 rounded-full shadow-md"
                                  style={{
                                    left: `${progressPercentage - 1}%`,
                                    transition: "left 0.3s ease",
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 justify-between me-4">
                            <TbPlayerTrackPrevFilled
                              onClick={() => playPrevSong()}
                              className="text-white text-xl hover:scale-110 transition-all cursor-pointer"
                            />

                            {isPlaying ? (
                              <svg
                                onClick={togglePlayPause}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="white"
                                viewBox="0 0 24 24"
                                className="w-8 h-8 cursor-pointer"
                              >
                                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />{" "}
                                {/* Pause Icon */}
                              </svg>
                            ) : (
                              <svg
                                onClick={togglePlayPause}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="white"
                                viewBox="0 0 24 24"
                                className="w-8 h-8 cursor-pointer"
                              >
                                <path d="M8 5v14l11-7z" /> {/* Play Icon */}
                              </svg>
                            )}
                            <TbPlayerTrackNextFilled
                              onClick={() => playNextSong()}
                              className="text-white text-xl cursor-pointer hover:scale-110 transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {/* artist filter buttons */}
                {loading ? (
                  <div className="relative mt-5 rounded-xl bg-white flex flex-wrap items-center md:gap-5 gap-3 md:p-0 p-3 animate-pulse">
                    {/* Skeleton for Individual Artist Buttons */}
                    <div className="flex flex-wrap gap-3">
                      {[...Array(5)].map((_, index) => (
                        <div
                          key={index}
                          className="bg-gray-300 w-32 h-10 rounded-xl flex items-center"
                        ></div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <ArtistButtons
                    setSelectedArtist={setSelectedArtist}
                    selectedArtist={selectedArtist}
                  />
                )}
                {/* Song List */}

                {loading ? (
                  <SongLoadingScalaton />
                ) : (
                  <>
                    {filteredSongs.length === 0 ? (
                      // Message when no songs match the search query
                      <div className="flex flex-col bg-white md:mt-0 mt-5 rounded-xl items-center justify-center h-32">
                        <p className="text-gray-500 text-lg font-semibold">
                          No songs match your search.
                        </p>
                        <p className="text-gray-400">
                          Try searching with a different keyword.
                        </p>
                      </div>
                    ) : (
                      // Display song list if there are matching results
                      <Suspense
                        fallback={
                          <div className="w-full px-4 py-8 mt-4 rounded-2xl flex items-center justify-center bg-white">
                            <div className="flex items-center justify-center">
                              <div className="flex flex-col items-center space-y-4">
                                <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                                <p className="text-xl text-center font-semibold text-gray-700">
                                  Please wait, the song is loading...
                                </p>
                                <p className="text-sm text-gray-500 italic">
                                  🎵 "Good things take time" 🎶
                                </p>
                              </div>
                            </div>
                          </div>
                        }
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-5">
                          {paginatedSongs.map((song) => (
                            <SongList
                              currentlyPlaying={songId === song.audioFile}
                              isPlaying={isPlaying}
                              key={song.songId}
                              image={songDetail?.highQualityThumbnailUrl ? songDetail?.highQualityThumbnailUrl : "/thumbnails/default-thumbnail-low.jpg"}
                              handlePlayer={() =>
                                handlePlayer(
                                  song.audioFile,
                                  song.songName,
                                  song.artistName
                                )
                              }
                              id={song._id}
                              songId={song.songId}
                              title={song.songName}
                              artist={song.artistName}
                              favourite={song.favourite}
                              isAdminLogin={isAuthenticated}
                              handleToggleEdit={handleToggleEdit}
                              fetchSongs={fetchSongs}
                            />
                          ))}
                        </div>
                      </Suspense>
                    )}

                    {/* Pagination Controls */}
                    {filteredSongs.length > 0 && (
                      <Pagination
                        filteredSongs={filteredSongs}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        handlePageClick={handlePageClick}
                        handlePrevPage={handlePrevPage}
                        handleNextPage={handleNextPage}
                      />
                    )}
                  </>
                )}
              </>
            )}
            {isNoSongsFound && (
              <div className="bg-gray-100 rounded-xl text-center p-8 shadow-lg flex flex-col items-center">
                <img
                  src="/no-songs.svg"
                  alt="No Songs Found"
                  className="w-32 h-32 mb-4"
                />
                <h2 className="text-2xl font-bold text-gray-700 mb-2">
                  Oops! No Songs Found
                </h2>
                <p className="text-gray-500 text-lg">
                  It seems like the song database is currently empty. <br />
                  Try searching with a different keyword or come back later!
                </p>
              </div>
            )}
          </div>

          {songId && (
            <div
              className={`transition-all ${
                hiddenPlayer
                  ? "opacity-0 z-[-1] duration-500"
                  : "opacity-100 z-10 duration-500"
              } 
            ${hiddenPlayer ? "sm:block md:hidden" : "sm:block md:block"} 
            `}
            >
              <MusicPlayer
                audioRef={audioRef}
                songId={player}
                handlePlayerClose={handlePlayerClose}
                songName={songDetail?.songName}
                artistName={songDetail?.artistName}
                image={songDetail?.highQualityThumbnailUrl}
                audioUrl={songDetail?.audioUrl}
                backgroundImage={songDetail?.lowQualityThumbnailUrl}
                favourite={songDetail?.favourite}
                playNextSong={playNextSong}
                playPrevSong={playPrevSong}
                SetisPlayingOrNotForLayout={setIsPlaying}
                setProgressPercentage={setProgressPercentage}
                songClickLoading={songClickLoading}
                setIsLoading={setIsLoading} // this is for song if song is buffering...
                isLoading={isLoading}
                songLoop={songLoop}
                setSongLoop={setSongLoop}
              />
            </div>
          )}

          {upload && (
            <Upload
              fetchSongs={fetchSongs}
              handleToggleUpload={handleToggleUpload}
            />
          )}
          {edit && (
            <EditSong
              fetchSongs={fetchSongs}
              handleToggleEdit={handleToggleEdit}
              songId={editSongId}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default Layout;
