import React, { useState, useRef, useEffect } from "react";
import { FaArrowLeft, FaPlay, FaPause } from "react-icons/fa";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { PiShuffle } from "react-icons/pi";
import { FaForward } from "react-icons/fa";
import { FaBackward } from "react-icons/fa";
import apiService from "../services/apiService";
import { BsRepeat1 } from "react-icons/bs";
import logo from "../assets/vite.svg"

const MusicPlayer = ({
  songName,
  playNextSong,
  playPrevSong,
  artistName,
  image,
  backgroundImage,
  handlePlayerClose,
  songId,
  favourite,
  audioRef,
  SetisPlayingOrNotForLayout,
  setProgressPercentage,
  songClickLoading,
  isLoading,
  setIsLoading,
  songLoop,
  setSongLoop,
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  // New state for loading
  const [isLiked, setIsLiked] = useState(favourite); // State to track toggle

  const progressBarRef = useRef(null);

  useEffect(() => {
    setIsLiked(favourite);
  }, [isLoading, totalDuration]);
  useEffect(() => {
    setIsLoading(true);
  }, [songId]);
  const handleToggle = async () => {
    setIsLiked((prev) => !prev); // Toggle state
    try {
      await apiService.toggleFavourite(songId); // Call the API to toggle the favorite status
    } catch (error) {
      console.error("Error toggling favourite status:", error);
      setIsLiked((prev) => !prev); // Revert the state if the API call fails
    }
  };

  const progressPercentage = (currentTime / totalDuration) * 100;

  useEffect(() => {
    if (totalDuration > 0) {
      setProgressPercentage((currentTime / totalDuration) * 100);
    }
  }, [currentTime, totalDuration]); // This will run every time currentTime or totalDuration changes

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const updateProgress = (clientX) => {
    if (!progressBarRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const offsetX = Math.min(Math.max(0, clientX - rect.left), rect.width);
    const newTime = (offsetX / rect.width) * totalDuration;
    setCurrentTime(newTime);
    if (audioRef.current) audioRef.current.currentTime = newTime;
  };

  const handleMove = (e) => {
    if (!isDragging) return;

    if (e.type === "mousemove") {
      updateProgress(e.clientX);
    } else if (e.type === "touchmove") {
      updateProgress(e.touches[0].clientX);
    }
  };

  const handleStart = (e) => {
    setIsDragging(true);

    if (e.type === "mousedown") {
      updateProgress(e.clientX);
    } else if (e.type === "touchstart") {
      updateProgress(e.touches[0].clientX);
    }
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  const togglePlay = () => {
    if (!audioRef.current) {
      console.error(
        "Audio reference is null. Ensure the <audio> tag is properly rendered."
      );
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      SetisPlayingOrNotForLayout(false);
    } else {
      setIsLoading(true); // Set loading state
      audioRef.current.play().catch((error) => {
        console.error("Error while trying to play the audio:", error);
        setIsLoading(false); // Reset loading state on error
      });
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const updateCurrentTime = () => {
      setCurrentTime(audioRef.current?.currentTime);
    };

    if (audioRef.current) {
      audioRef.current.addEventListener("timeupdate", updateCurrentTime);
      audioRef.current.addEventListener("playing", () => {
        setIsPlaying(true);
        SetisPlayingOrNotForLayout(true);
        setIsLoading(false); // Remove loading state when playing starts
      });
      audioRef.current.addEventListener("ended", () => {
        setIsPlaying(false);
        SetisPlayingOrNotForLayout(false);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", updateCurrentTime);
      }
    };
  }, []);

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setTotalDuration(audioRef.current.duration);
      audioRef.current.play(); // Start playing once metadata is loaded
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  const handleNextSong = (songId) => {
    if(songLoop){
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }else if (playNextSong) {
      setIsLoading(true);
      playNextSong(songId);
      if (audioRef.current) {
        setIsLoading(true); // Show loading state
        setTimeout(() => {
          audioRef.current?.play().catch((error) => {
            console.error("Error playing the next song:", error);
          });
        }, 300); // Slight delay for smooth transition
      }
    }
  };

  const handlePrevSong = (songId) => {
    if(songLoop){
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }else if (playPrevSong) {
      setIsLoading(true);
      playPrevSong(songId);
      if (audioRef.current) {
        setIsLoading(true); // Show loading state
        setTimeout(() => {
          audioRef.current.play().catch((error) => {
            console.error("Error playing the previous song:", error);
          });
        }, 300); // Slight delay for smooth transition
      }
    }
  };

  useEffect(() => {
    const updateCurrentTime = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    };

    const handleAudioEnded = () => {
      if (audioRef.current) {
        audioRef.current.pause(); // Pause the current song
      }

      setIsPlaying(false);
      SetisPlayingOrNotForLayout(false);
      setIsLoading(true); // Set loading state when the song ends

      if (playNextSong) {
        handleNextSong(songId);
      } else {
        setIsLoading(false); // Remove loading state if no next song is available
      }
    };

    if (audioRef.current) {
      audioRef.current.addEventListener("timeupdate", updateCurrentTime);
      audioRef.current.addEventListener("playing", () => {
        setIsPlaying(true);
        SetisPlayingOrNotForLayout(true);
        setIsLoading(false); // Remove loading state when playback starts
      });
      audioRef.current.addEventListener("ended", handleAudioEnded);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", updateCurrentTime);
        audioRef.current.removeEventListener("ended", handleAudioEnded);
      }
    };
  }, [playNextSong]);

  return (
    <div
      className="fixed z-50 top-0 left-0 w-full h-full backdrop-blur-md flex justify-center text-white items-center"
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
    >
      <div
        style={{
          backgroundImage: songClickLoading
            ? "none" // No image when true
            : `url(${import.meta.env.VITE_BASEURL}/assets${backgroundImage})`, // Image when false
        }}
        className="transition-all duration-700 md:w-[90%] relative md:h-[95%] bg-no-repeat bg-center bg-cover overflow-auto no-scrollbar h-full w-full md:rounded-[30px]"
      >
        <div
          className={`${
            songClickLoading ? "bg-white" : "bg-white/80 md:bg-black/20"
          } backdrop-blur-xl p-4 h-full overflow-auto no-scrollbar`}
        >
          <div className="flex text-black md:text-white absolute md:top-7 md:left-7 justify-between items-center">
            {songClickLoading ? (
              <div className="w-8 h-8 bg-gray-500 animate-pulse rounded-full"></div>
            ) : (
              <FaArrowLeft
                onClick={() => handlePlayerClose(songId, songName, artistName)}
                className="text-xl cursor-pointer"
              />
            )}
          </div>
          <div className="flex md:flex-row h-full flex-col items-center justify-evenly">
            {songClickLoading ? (
              <div className="transition-all md:mb-0 mb-5 px-3 py-5 md:w-[50%] w-full flex justify-center">
                <div className="md:w-[80%] w-[270px] h-[200px] md:h-[300px] bg-gray-500 animate-pulse rounded-3xl"></div>
              </div>
            ) : (
              <div className="transition-all md:mb-0 mb-5 px-3 py-5 md:w-[50%] w-full flex justify-center">
                <img
                  src={`${import.meta.env.VITE_BASEURL}/assets${image}`}
                  alt="Album Art"
                  className="transition-all shadow-2xl md:w-[80%] w-[270px] rounded-3xl"
                />
              </div>
            )}
            {songClickLoading ? (
              <div className="transition-all flex items-center justify-center md:w-[60%] w-full">
                <div className="md:rounded-3xl w-full md:p-2 md:py-4 md:border-2 md:border-black/20">
                  <div className="flex items-center px-3 justify-between">
                    <div className="flex flex-col gap-2">
                      <div className="w-40 h-8 bg-gray-500 animate-pulse rounded"></div>
                      <div className="w-32 h-5 bg-gray-500 animate-pulse rounded"></div>
                    </div>
                    <div className="w-8 h-8 bg-gray-500 animate-pulse rounded-full"></div>
                  </div>
                  <div className="px-3 mt-5">
                    <div className="flex items-center justify-between text-sm text-gray-200">
                      <div className="w-16 h-4 bg-gray-500 animate-pulse rounded"></div>
                      <div className="w-16 h-4 bg-gray-500 animate-pulse rounded"></div>
                    </div>
                    <div className="relative w-full h-2 bg-gray-500 rounded-lg mt-2">
                      <div className="absolute top-1/2 transform -translate-y-1/2 bg-gray-500 w-4 h-4 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex items-center md:justify-center justify-evenly gap-5 mt-5">
                    <div className="p-3 rounded-full bg-gray-500 animate-pulse w-[30px] h-[30px]"></div>
                    <div className="p-3 rounded-full bg-gray-500 animate-pulse w-[40px] h-[40px]"></div>
                    <div className="p-3 rounded-full bg-gray-500 animate-pulse md:w-[50px] md:h-[50px] w-[60px] h-[60px]"></div>
                    <div className="p-3 rounded-full bg-gray-500 animate-pulse w-[40px] h-[40px]"></div>
                    <div className="p-3 rounded-full bg-gray-500 animate-pulse w-[30px] h-[30px]"></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="transition-all flex items-center justify-center md:w-[60%]">
                <div className="md:rounded-3xl w-full md:p-2 md:border-2 md:border-white/20">
                  <div className="flex items-center text-black md:text-white px-3 justify-between">
                    <div className="flex flex-col">
                      <div
                        title={songName}
                        className="font-extrabold md:leading-[50px] line-clamp-2 md:text-4xl text-3xl"
                      >
                        {songName}
                      </div>
                      <span className="md:text-xl capitalize font-thin text-lg text-gray-700 md:text-gray-100">
                        {artistName}
                      </span>
                    </div>
                    <div
                      onClick={handleToggle}
                      className="h-full flex items-center justify-end cursor-pointer"
                    >
                      <svg
                        fill={isLiked ? "#e7125c" : "none"}
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ transition: "all 0.5s ease, stroke 0.1s"}}
                        className={`${
                          isLiked
                            ? "stroke-[#e7125c]"
                            : "md:stroke-white stroke-black"
                        } md:text-4xl text-3xl active:scale-90 hover:scale-110  duration-500`}
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="px-3 mt-5">
                    <div className="flex items-center justify-between text-sm text-gray-600 md:text-gray-200">
                      <span>
                        {isLoading ? "Buffering..." : formatTime(currentTime)}
                      </span>
                      <span>{formatTime(totalDuration)}</span>
                    </div>
                    <div
                      className="relative w-full h-2 md:bg-white/20 bg-black/10 rounded-lg mt-2 cursor-pointer"
                      ref={progressBarRef}
                      onMouseDown={handleStart}
                      onTouchStart={handleStart}
                    >
                      <div
                        className="absolute top-0 left-0 h-2 bg-orange-500 rounded-lg"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                      <div
                        className="absolute top-1/2 transform -translate-y-1/2 md:bg-white bg-orange-500 w-4 h-4 rounded-full cursor-pointer"
                        style={{ left: `${progressPercentage - 1}%` }}
                        draggable="false"
                      ></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-5 mt-5">
                    <button  onClick={() => setSongLoop(!songLoop)} className="p-3 rounded-full">
                      {!songLoop ? (
                        <PiShuffle className="md:text-white hover:scale-110 transition-all text-black md:text-lg text-3xl" />
                      ) : (
                        <BsRepeat1 className="md:text-white hover:scale-110 transition-all text-black md:text-lg text-3xl" />
                      )}
                    </button>
                    <button
                      onClick={() => handlePrevSong(songId)}
                      className="p-3 rounded-full"
                    >
                      <FaBackward className="md:text-white text-black text-3xl" />
                    </button>
                    <button
                      className="md:p-3 p-4 flex items-center justify-center md:bg-orange-500 bg-black rounded-full"
                      onClick={togglePlay}
                    >
                      {isPlaying ? (
                        <FaPause className="text-white text-2xl md:text-lg" />
                      ) : (
                        <FaPlay className="text-white text-2xl md:text-lg" />
                      )}
                    </button>
                    <button
                      onClick={() => handleNextSong(songId)}
                      className={`p-3 rounded-full ${songId}`}
                    >
                      <FaForward className="md:text-white text-black text-3xl" />
                    </button>
                    <button onClick={toggleMute} className="p-3 rounded-full">
                      {isMuted ? (
                        <HiSpeakerXMark className="md:text-white  hover:scale-110 transition-all text-black md:text-lg text-3xl" />
                      ) : (
                        <HiSpeakerWave className="md:text-white  hover:scale-110 transition-all text-black md:text-lg text-3xl" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <audio
        ref={audioRef}
        src={`${import.meta.env.VITE_BASEURL}/stream/${songId}`}
        preload="auto"
        onLoadedMetadata={handleLoadedMetadata}
      />
    </div>
  );
};

export default MusicPlayer;
