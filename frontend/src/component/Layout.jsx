import React, { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ThemeProvider } from '../context/theme'
import { LiaTimesSolid } from 'react-icons/lia'
import { TbPlayerTrackNextFilled, TbPlayerTrackPrevFilled } from 'react-icons/tb'
import apiService from '../services/apiService'
import MusicPlayer from './MusicPlayer'
import { useExtractColors } from 'react-extract-colors'

function Layout() {
    const { songId } = useParams()

    const [songClickLoading, setSongClickLoading] = useState(false);
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
    const [songLoop, setSongLoop] = useState(false);
    const [image, setImage] = useState('/thumbnails/default-thumbnail-low.png')
    const navigate = useNavigate();
    const { colors } = useExtractColors(
        `${import.meta.env.VITE_BASEURL}/assets${image}`,
        {
            maxColors: 4,
            format: "hex",
            maxSize: 400,
            orderBy: "vibrance",
        }
    );
    // Select or create the meta theme-color tag
    let metaThemeColor = document.querySelector("meta[name='theme-color']");
    if (!metaThemeColor) {
        metaThemeColor = document.createElement("meta");
        metaThemeColor.name = "theme-color";
        document.head.appendChild(metaThemeColor);
    }


    // Update theme color
    metaThemeColor.setAttribute("content", colors[2] || "#ffffff");

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
            // navigate(`/song/${nextSongId}`);
        }
    };

    // Play the previous song
    const playPrevSong = async () => {
        const prevSongId = getPrevSongId(player);
        if (prevSongId) {
            setPlayer(prevSongId);
            // navigate(`/song/${prevSongId}`);
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
                const response = await apiService.getSongInfo(player);
                setSongDetail(response);
                setImage(response.highQualityThumbnailUrl)
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
        if (player !== 0) {
            fetchSongDetails();
        }
    }, [player]);
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
        }, 4000);
    }, [songDetail]);
    useEffect(() => {
        const link = document.getElementsByTagName("link")[0];
        const title = document.getElementsByTagName("title")[0];
        link.href = songDetail?.highQualityThumbnailUrl
            ? `${import.meta.env.VITE_BASEURL}/assets` +
            songDetail?.highQualityThumbnailUrl
            : "/icon.png";
        title.innerText = songDetail?.songName
            ? songDetail?.songName + " • " + songDetail?.artistName
            : "PlayBeatz";

    }, [songDetail?.highQualityThumbnailUrl]);

    // Function to close the player
    const handlePlayerClose = async (id, name, artist) => {
        setCurrentPlayingSong({
            id,
            name,
            artist,
        });
        setHiddenPlayer(true);
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
                            playNextSong,
                            songClickLoading,
                            setSongClickLoading
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

                    <div className={`fixed z-[3] bottom-0 left-0 right-0 py-4 pt-5 bg-gradient-to-t from-black/80 via-black/40 to-transparent md:right-5 md:p-0 px-4 group w-full md:w-auto`}>
                        {/* Player Container with Hover Effect */}
                        <div
                            className={`flex relative items-center overflow md:group-hover:rounded-2xl md:rounded-full rounded-2xl transition-all duration-500 md:w-[76px] w-full md:group-hover:w-[350px]
                                            ${image ? "bg-center bg-cover" : ""}
                                        `}
                            style={{
                                backgroundImage:
                                    window.innerWidth >= 768
                                        ? `url(${import.meta.env.VITE_BASEURL}/assets${image})`
                                        : "none",
                                backgroundColor: window.innerWidth < 768 ? colors[3] : "transparent",
                            }}
                        >
                            {/* Close Button */}
                            <div
                                onClick={() => {
                                    setPlayer(0)
                                    if (songId) navigate('/')
                                }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute -top-2 text-xs right-[2px] cursor-pointer rounded-full p-[2px] text-gray-500 bg-white z-10"
                            >
                                <LiaTimesSolid />
                            </div>
                            {/* Progress Bar */}
                            <div className="md:group-hover:block md:hidden absolute left-0 bottom-0 px-4 w-full z-10 h-[3px]">
                                <div
                                    className="bg-white h-full"
                                    style={{ width: `${progressPercentage}%` }}
                                >
                                </div>
                            </div>
                            <div className="flex px-3 md:py-2 bg-black/25 md:group-hover:rounded-2xl md:rounded-full rounded-xl w-full items-center justify-between backdrop-blur-md">
                                {/* Song Thumbnail */}
                                <img
                                    onClick={() =>
                                        setHiddenPlayer((prevState) => !prevState)
                                    } // Toggle visibility
                                    src={
                                        `${import.meta.env.VITE_BASEURL}/assets${image}`
                                    }
                                    alt="Song Thumbnail"
                                    className={`md:w-14 md:h-14 md:rounded-full w-10 h-10 rounded-lg  cursor-pointer object-cover md:animate-spin-slow transition-transform duration-500`}
                                    style={{ animationPlayState: `${isPlaying ? "running" : "paused"}` }}
                                />

                                {/* Song Info - Only Visible on Hover */}
                                <div
                                    onClick={() =>
                                        setHiddenPlayer((prevState) => !prevState)
                                    }
                                    className={`flex cursor-pointer flex-col w-full md:opacity-0 md:group-hover:opacity-100 ps-2 pe-5 py-2 transition-all duration-500`}
                                >
                                    <p className="font-bold md:text-xl text-nowrap text-white">
                                        {currentPlayingSong?.name
                                            ? isLoading
                                                ? "Buffering..."
                                                : isPlaying
                                                    ? "Now Playing"
                                                    : "Paused"
                                            : "Please wait"}
                                    </p>
                                    {currentPlayingSong?.name ? (
                                        <marquee className="text-xs text-nowrap text-gray-200" scrollamount="2">
                                            {isPlaying
                                                ? `${currentPlayingSong.name} • ${currentPlayingSong.artist}`
                                                : isLoading
                                                    ? "Your song is loading please wait..."
                                                    : "Click play to start the music!"}
                                        </marquee>
                                    ) : (
                                        <div className="text-xs text-nowrap text-gray-200">Loading your next song...</div>
                                    )}
                                </div>

                                {/* Controls - Play, Pause, Next, and Prev */}
                                <div
                                    className={`md:hidden md:group-hover:flex flex items-center gap-2 justify-between me-4 transition-all duration-500`}
                                >
                                    <TbPlayerTrackPrevFilled
                                        onClick={() => playPrevSong()}
                                        className="text-white md:text-xl hover:scale-110 transition-all cursor-pointer"
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
                                        className="text-white md:text-xl cursor-pointer hover:scale-110 transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                </>}

                {player !== undefined && player !== 0 && (
                    <div
                        className={`fixed w-screen h-screen top-0 left-0 z-[60] transition-top duration-500 ease-in-out
                            ${hiddenPlayer ? "top-full" : "top-0"}
                        sm:block
                    `}
                    >
                        <MusicPlayer
                            audioRef={audioRef}
                            songId={player}
                            id={songDetail?._id}
                            likes={songDetail?.likes}
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
                            totalDuration={totalDuration}
                            songClickLoading={songClickLoading}
                            setIsLoading={setIsLoading} // this is for song if song is buffering...
                            isLoading={isLoading}
                            songLoop={songLoop}
                            setSongLoop={setSongLoop}
                            colors={colors}
                        />
                    </div>
                )}
            </div>
        </ThemeProvider>
    )
}

export default Layout
