import React, { Suspense, useState, useEffect } from "react";
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
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track if user is authenticated

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

  // Fetch songs from the backend
  const fetchSongs = async () => {
    try {
      setLoading(true);
      const songs = await apiService.getSongs();
      setSongList(songs);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch songs");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  // Fetch song details based on songId from URL
  useEffect(() => {
    if (songId) {
      const fetchSongDetails = async () => {
        try {
          setSongClickLoading(true);
          const response = await apiService.getSongInfo(songId);
          setSongDetail(response);
          setHiddenPlayer(false); // Make the player visible when a song is selected
          setSongClickLoading(false);
        } catch (err) {
          console.error("Failed to fetch song details:", err);
          navigate("/no-song-found");
          setSongClickLoading(false);
        }
      };

      fetchSongDetails();
    }
  }, [songId]);

  // Handle song click to navigate and set player state
  const handlePlayer = (id) => {
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
      (song) => song.songId === currentSongId
    );
    if (currentIndex === -1) return null;

    const nextIndex = (currentIndex + 1) % songList.length;
    return songList[nextIndex].songId;
  };

  // Get the previous song ID
  const getPrevSongId = (currentSongId) => {
    const currentIndex = songList.findIndex(
      (song) => song.songId === currentSongId
    );
    if (currentIndex === -1) return null;

    const prevIndex = (currentIndex - 1 + songList.length) % songList.length;
    return songList[prevIndex].songId;
  };

  // Function to close the player
  const handlePlayerClose = async () => {
    setHiddenPlayer(true); // Hide the player
    navigate(`/`); // Navigate to home page
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
  console.log(songList);
  

  return (
    <>
      <div className="h-screen bg-fixed overflow-auto bg-[url(/bg.jpg)] bg-center bg-cover">
        <Header handleToggleUpload={handleToggleUpload} />
        <div className="flex flex-col md:px-10 mb-5 w-full text-white overflow-auto">
          <div className="md:bg-white md:border p-4 pb-5 md:rounded-2xl">
            <div className="flex justify-between md:w-[500px]">
            <input
              type="text"
              className="md:w-[75%] w-full text-black border rounded-lg py-4 px-3 outline-none"
              placeholder="Search what you love"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-5">
              <Suspense fallback={<SongLoadingScalaton />}>
                {songList
                  .filter(
                    (song) =>
                      song.songName
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      song.artistName
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                  )
                  .map((song) => (
                    <SongList
                      key={song.songId}
                      handlePlayer={() => handlePlayer(song.songId)} // Handle song click and navigate
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
        </div>
      </div>
    </>
  );
}

export default Layout;
