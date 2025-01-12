import React, { Suspense, useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom"; // useParams for URL parameters and useNavigate for navigation
import apiService from "../services/apiService";

// Lazy load the SongList component
const SongList = React.lazy(() => import("./SongList"));
import MusicPlayer from "./MusicPlayer";
import Header from "./Header";
import SongLoadingScalaton from "./SongLoadingScalaton";
import Upload from "./Upload";
import axios from "axios";
import EditSong from "./EditSong";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import SongClickLoader from "./SongClickLoader";

function Layout() {
  const { songId } = useParams(); // Get songId from URL
  const [songDetail, setSongDetail] = useState(null);
  const [songList, setSongList] = useState([]);
  const [hiddenPlayer, setHiddenPlayer] = useState(false); // Manage visibility
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [upload, setUpload] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editSongId, setEditSongId] = useState("");
  const [player, setPlayer] = useState(songId ? songId : 0); // To handle current song
  const [songClickLoading, setSongClickLoading] = useState(false);
  const [isNoSongsFound, setIsNoSongsFound] = useState(true);
  const [currentPlayingSong, setCurrentPlayingSong] = useState({
    id: 0,
    name: "",
    artist: "",
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track if user is authenticated
  const [currentPage, setCurrentPage] = useState(1);
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
      setLoading(true);
      const songs = await apiService.getSongs();
      if (songs.length === 0) {
        setIsNoSongsFound(true); // Set state to true if no songs are found
      } else {
        setIsNoSongsFound(false); // Set state to false if songs are found
      }

      setSongList(songs); // If no songs, songs will be an empty array
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
  }, []);

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

    const deleteThumbnails = async () => {
      console.log(player);
      try {
        await apiService.deleteThumbnails(player);
        // console.log(`Thumbnails for songId ${player} deleted successfully.`);
      } catch (error) {
        console.error("Error deleting thumbnails:", error.message);
      }
    };

    const fetchSongDetails = async () => {
      setSongClickLoading(true); // Start loading
      try {
        const response = await apiService.getSongInfo(songId);
        setSongDetail(response);
        setHiddenPlayer(false); // Make the player visible
      } catch (err) {
        console.error("Failed to fetch song details:", err);
        navigate("/no-song-found"); // Redirect on error
      } finally {
        setSongClickLoading(false); // Stop loading
      }
    };

    // Reset state and delete thumbnails
    resetPlayerState();
    deleteThumbnails();

    // Fetch song details if `songId` exists
    if (songId) {
      fetchSongDetails();
    }
  }, [songId]);

  // Handle song click to navigate and set player state
  const handlePlayer = (id, title, artist) => {
    setSongClickLoading(true);
    setCurrentPlayingSong({
      id,
      name: title,
      artist,
    });
    setPlayer(id);
    navigate(`/${id}`);
  };

  // Play the next song
  const playNextSong = async () => {
    try {
      await apiService.deleteThumbnails(player);
      // console.log(`Thumbnails for songId ${player} deleted successfully.`);
      const nextSongId = getNextSongId(player);
      setPlayer(nextSongId);
      navigate(`/${nextSongId}`);
    } catch (error) {
      console.error("Error deleting thumbnails:", error.message);
    }
  };

  // Play the previous song
  const playPrevSong = async () => {
    setSongClickLoading(true);
    try {
      await apiService.deleteThumbnails(player);
      // console.log(`Thumbnails for songId ${player} deleted successfully.`);
      const prevSongId = getPrevSongId(player);
      if (prevSongId) {
        setPlayer(prevSongId);
        navigate(`/${prevSongId}`);
      }
    } catch (error) {
      console.error("Error deleting thumbnails:", error.message);
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
    setHiddenPlayer(true); // Hide the player
    try {
      await apiService.deleteThumbnails(player);
      // console.log(`Thumbnails for songId ${player} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting thumbnails:", error.message);
    }
  };

  if (loading) {
    return <SongLoadingScalaton />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <div className="h-screen bg-fixed overflow-auto bg-[url(/bg.jpg)] bg-center bg-cover">
        <Header handleToggleUpload={handleToggleUpload} />
        <div className="flex flex-col md:px-10 mb-5 w-full text-white overflow-auto">
          <div className="md:bg-white md:border p-4 pb-5 md:rounded-2xl">
            {!isNoSongsFound && (
              <>
                <div className="flex gap-5 md:flex-row flex-col items-center w-full text-black justify-between">
                  <input
                    type="text"
                    className="md:w-[376px] focus:outline-gray-300 focus:outline-2 outline-offset-2 w-full text-black border rounded-lg py-4 px-3 outline-none"
                    placeholder="Search what you love"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {currentPlayingSong.id !== 0 && (
                    <div
                      className="w-full overflow-hidden rounded-xl md:w-[220px] inline-block cursor-pointer"
                      onClick={() => setHiddenPlayer((prevState) => !prevState)} // Toggle visibility
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
                      <div className="flex bg-black/25 backdrop-blur-md w-full ps-2 pe-5 py-2 items-center gap-3">
                        <img
                          src={
                            songDetail
                              ? `${import.meta.env.VITE_BASEURL}/assets${
                                  songDetail?.lowQualityThumbnailUrl
                                }`
                              : "/player.png"
                          }
                          alt="player.png"
                          className="w-14 h-14 rounded-full object-cover animate-spin-slow"
                        />
                        <div className="flex flex-col md:w-full w-fit">
                          <p className="font-bold text-xl text-white">
                            Now Playing
                          </p>
                          <marquee
                            className="text-xs text-gray-200"
                            behavior=""
                            scrollamount="2"
                          >
                            {currentPlayingSong.name} •{" "}
                            {currentPlayingSong.artist}
                          </marquee>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {/* Song List */}

                {filteredSongs.length === 0 ? (
                  // Message when no songs match the search query
                  <div className="flex flex-col items-center justify-center h-32">
                    <p className="text-gray-500 text-lg font-semibold">
                      No songs match your search.
                    </p>
                    <p className="text-gray-400">
                      Try searching with a different keyword.
                    </p>
                  </div>
                ) : (
                  // Display song list if there are matching results
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-5">
                    <Suspense fallback={<SongLoadingScalaton />}>
                      {paginatedSongs.map((song) => (
                        <SongList
                          key={song.songId}
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
                    </Suspense>
                  </div>
                )}

                {/* Pagination Controls */}
                {filteredSongs.length > 0 && (
                  <div className="flex justify-center mt-4 items-center">
                    {/* Previous Button */}
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className="rounded-lg md:text-black"
                    >
                      <FaAngleLeft className="text-2xl" />
                    </button>

                    {/* Page Numbers */}
                    <div className="flex space-x-2 px-4 py-2">
                      {pageNumbers.map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageClick(page)}
                          className={`px-4 py-2 border rounded-lg ${
                            page === currentPage
                              ? "md:bg-black bg-white md:text-white text-black"
                              : "md:text-black text-white"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="md:text-black"
                    >
                      <FaAngleRight className="text-2xl" />
                    </button>
                  </div>
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

          {/* Conditionally render MusicPlayer if songDetail is available */}
          {songDetail && (
            <div className={`${hiddenPlayer ? "hidden" : "block"}`}>
              <MusicPlayer
                songId={player}
                handlePlayerClose={handlePlayerClose}
                songName={songDetail.songName}
                artistName={songDetail.artistName}
                image={songDetail.highQualityThumbnailUrl}
                audioUrl={songDetail.audioUrl}
                backgroundImage={songDetail.lowQualityThumbnailUrl}
                favourite={songDetail.favourite}
                playNextSong={playNextSong}
                playPrevSong={playPrevSong}
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
          {songClickLoading && <SongClickLoader />}
        </div>
      </div>
    </>
  );
}

export default Layout;
