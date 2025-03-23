import React, { useEffect, useRef, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { ThemeProvider } from '../context/theme'
import { LiaTimesSolid } from 'react-icons/lia'
import { TbPlayerTrackNextFilled, TbPlayerTrackPrevFilled } from 'react-icons/tb'

function Layout() {
    // Define player and audioRef in Layout to manage audio globally
    const [player, setPlayer] = useState(0) // Default to 0 or undefined initially
    const [totalDuration, setTotalDuration] = useState(0)
    const [isLoading, setIsLoading] = useState(false) // New loading state
    const audioRef = useRef(null)
    const [currentPlayingSong, setCurrentPlayingSong] = useState({
        id: 0,
        name: "",
        artist: "",
    });
    const [isPlaying, setIsPlaying] = useState(false);
    const [songDetail, setSongDetail] = useState(null);
    const [hiddenPlayer, setHiddenPlayer] = useState(true); // Manage visibility
    const [progressPercentage, setProgressPercentage] = useState(0);
    const [songList, setSongList] = useState([]);
    const navigate = useNavigate();

    // Handle metadata and play audio
    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setTotalDuration(audioRef.current.duration)
            audioRef.current.play().catch((err) => {
                console.error('Error playing audio:', err)
                setIsLoading(false) // Stop loading on error
            })
            setIsLoading(false) // Stop loading after metadata is loaded
        }
    }

    // Handle audio loading error
    const handleError = () => {
        console.error('Error loading audio file')
        setIsLoading(false) // Stop loading on error
    }

    // Handle theme change
    const [themeMode, setThemeMode] = useState(localStorage.getItem('theme') || 'light')
    const lightTheme = () => setThemeMode('light')
    const darkTheme = () => setThemeMode('dark')

    useEffect(() => {
        document.querySelector('html').classList.remove('light', 'dark')
        document.querySelector('html').classList.add(themeMode)
        localStorage.setItem('theme', themeMode)
    }, [themeMode])

    // Load and play audio only when player is valid and changes
    useEffect(() => {
        if (player && player !== 0 && audioRef.current) {
            setIsLoading(true) // Start loading when player changes
            audioRef.current.load() // Load the new audio
        }
    }, [player])
    const togglePlayPause = () => {
        if (audioRef.current.paused) {
            audioRef.current.play();
            setIsPlaying(true);
        } else {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

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

    return (
        <ThemeProvider value={{ lightTheme, darkTheme, themeMode }}>
            <div className="md:bg-black/20 transition-all duration-500">
                <div
                    className={`h-screen md:px-10 bg-fixed overflow-auto bg-center bg-cover transition-all duration-500 bg-[url('/src/assets/Blur.png')] dark:bg-[url('/src/assets/bg_dark.jpg')]`}
                >
                    {/* Pass player, audioRef, and isLoading to children using Outlet */}
                    <Outlet
                        context={{
                            player,
                            setPlayer,
                            songList,
                            setSongList,
                            totalDuration,
                            isLoading,
                            setIsLoading,
                            audioRef,
                            handleLoadedMetadata,
                            currentPlayingSong,
                            setCurrentPlayingSong,
                            isPlaying,
                            setIsPlaying,
                            songDetail,
                            setSongDetail,
                            hiddenPlayer,
                            setHiddenPlayer,
                            progressPercentage,
                            setProgressPercentage,
                            playPrevSong,
                            playNextSong
                        }}
                    />

                </div>

                {/* ✅ Conditionally render audio tag only when player is valid */}
                {player !== undefined && player !== 0 && <>
                    <audio
                        ref={audioRef}
                        key={player} // Reload audio when song changes
                        src={`${import.meta.env.VITE_BASEURL}/songs/stream/${player}`}
                        preload="auto"
                        onLoadedMetadata={handleLoadedMetadata}
                        onError={handleError}
                    />

                    <div className="fixed bottom-3  right-5 group w-14 md:w-auto">
                        {/* Close Button */}
                        <div
                            onClick={() => navigate("/")}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute -top-2 text-xs right-[2px] cursor-pointer rounded-full p-[2px] text-gray-500 bg-white z-10"
                        >
                            <LiaTimesSolid />
                        </div>

                        {/* Player Container with Hover Effect */}
                        <div
                            className="flex items-center overflow-hidden group-hover:rounded-2xl rounded-full transition-all duration-500 w-[76px] group-hover:w-[350px]"
                            style={{
                                backgroundImage: songDetail
                                    ? `url(${import.meta.env.VITE_BASEURL}/assets${songDetail?.lowQualityThumbnailUrl})`
                                    : `url(${import.meta.env.VITE_BASEURL}/assets/thumbnails/default-thumbnail-low.png)`, // Fallback image
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        >
                            <div className="flex px-3 bg-black/25 w-full items-center justify-between backdrop-blur-md">
                                {/* Song Thumbnail */}
                                <img
                                    onClick={() =>
                                        setHiddenPlayer((prevState) => !prevState)
                                    } // Toggle visibility
                                    src={
                                        songDetail
                                            ? `${import.meta.env.VITE_BASEURL}/assets${songDetail?.highQualityThumbnailUrl}`
                                            : `${import.meta.env.VITE_BASEURL}/assets/thumbnails/default-thumbnail-low.png`
                                    }
                                    alt="Song Thumbnail"
                                    className={`w-14 h-14 rounded-full cursor-pointer object-cover animate-spin-slow transition-transform duration-500`}
                                    style={{ animationPlayState: `${isPlaying ? "running" : "paused"}` }}
                                />

                                {/* Song Info - Only Visible on Hover */}
                                <div
                                    className={`flex flex-col w-full opacity-0 group-hover:opacity-100 ps-2 pe-5 py-2 transition-all duration-500`}
                                >
                                    <p className="font-bold text-xl text-nowrap text-white">
                                        {currentPlayingSong?.name
                                            ? isLoading
                                                ? "Buffering..."
                                                : isPlaying
                                                    ? "Now Playing"
                                                    : "Paused"
                                            : "Please wait"}
                                    </p>
                                    {currentPlayingSong?.name ? (
                                        <marquee className="text-xs text-gray-200" scrollamount="2">
                                            {isPlaying
                                                ? `${currentPlayingSong.name} • ${currentPlayingSong.artist}`
                                                : isLoading
                                                    ? "Your song is loading please wait..."
                                                    : "Click play to start the music!"}
                                        </marquee>
                                    ) : (
                                        <div className="text-xs text-gray-200">Loading your next song...</div>
                                    )}
                                    {/* Progress Bar */}
                                    <div className="relative w-full mt-3 bg-white/20 rounded-full h-[3px]">
                                        <div
                                            className="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-300"
                                            style={{ width: `${progressPercentage}%` }}
                                        >
                                            <div
                                                className="absolute transition-all duration-700 top-1/2 transform -translate-y-1/2 bg-white w-3 h-3 rounded-full shadow-md"
                                                style={{
                                                    left: `95%`,
                                                    transition: "left 0.3s ease",
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Controls - Play, Pause, Next, and Prev */}
                                <div
                                    className={`hidden group-hover:flex items-center gap-2 justify-between me-4 transition-all duration-500`}
                                >
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
                                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /> {/* Pause Icon */}
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

                </>}
            </div>
        </ThemeProvider>
    )
}

export default Layout
