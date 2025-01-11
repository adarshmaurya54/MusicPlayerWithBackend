import React, { useState, useRef, useEffect } from "react";
import { FaArrowLeft, FaPlay, FaPause, FaHeart } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { PiShuffle } from "react-icons/pi";
import { FaForward } from "react-icons/fa";
import { FaBackward } from "react-icons/fa";
import apiService from "../services/apiService";

const MusicPlayer = ({
  songName,
  playNextSong,
  playPrevSong,
  artistName,
  image,
  backgroundImage,
  handlePlayerClose,
  songId,
  audioUrl,
  favourite,
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // New state for loading
  const [isLiked, setIsLiked] = useState(favourite); // State to track toggle
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);
  useEffect(() => {
    setIsLiked(favourite);
  }, [isLoading, totalDuration]);
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
    } else {
      setIsLoading(true); // Set loading state
      audioRef.current.play().catch((error) => {
        console.error("Error while trying to play the audio:", error);
        setIsLoading(false); // Reset loading state on error
      });
    }
  };

  useEffect(() => {
    const updateCurrentTime = () => {
      setCurrentTime(audioRef.current.currentTime);
    };

    if (audioRef.current) {
      audioRef.current.addEventListener("timeupdate", updateCurrentTime);
      audioRef.current.addEventListener("playing", () => {
        setIsPlaying(true);
        setIsLoading(false); // Remove loading state when playing starts
      });
      audioRef.current.addEventListener("ended", () => setIsPlaying(false));
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
    if (playNextSong) {
      playNextSong(songId);
      if (audioRef.current) {
        setIsLoading(true); // Show loading state
        setTimeout(() => {
          audioRef.current.play().catch((error) => {
            console.error("Error playing the next song:", error);
          });
        }, 300); // Slight delay for smooth transition
      }
    }
  };

  const handlePrevSong = (songId) => {
    if (playPrevSong) {
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
      // Pause the current song
      if (audioRef.current) {
        audioRef.current.pause();
      }

      setIsPlaying(false);
      setIsLoading(true); // Show loading state

      if (playNextSong) {
        // Fetch the next song's data
        playNextSong()
          .then((newSongData) => {
            // Update the audio source with the new song's URL
            if (audioRef.current) {
              audioRef.current.src = newSongData.audioUrl;
              setTotalDuration(0); // Reset total duration for the new song
              setCurrentTime(0); // Reset current time
            }
            setIsLoading(false); // Remove loading state
            setTimeout(() => {
              // Play the next song once it's ready
              if (audioRef.current) {
                audioRef.current.play().catch((error) => {
                  console.error("Error playing the next song:", error);
                });
              }
            }, 300); // Slight delay for a smooth transition
          })
          .catch((error) => {
            console.error("Error loading the next song:", error);
            setIsLoading(false); // Remove loading state if an error occurs
          });
      }
    };

    if (audioRef.current) {
      audioRef.current.addEventListener("timeupdate", updateCurrentTime);
      audioRef.current.addEventListener("playing", () => {
        setIsPlaying(true);
        setIsLoading(false); // Remove loading state when playing starts
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
          backgroundImage: `url(${
            import.meta.env.VITE_BASEURL
          }/assets${backgroundImage})`,
        }}
        className="transition-all duration-700 md:w-[90%] relative md:h-[95%] bg-no-repeat bg-center bg-cover overflow-auto no-scrollbar h-full w-full md:rounded-[30px]"
      >
        <div className="bg-black/50 p-4 h-full overflow-auto no-scrollbar backdrop-blur-md">
          <div className="flex absolute md:top-7 md:left-7 justify-between items-center">
            <FaArrowLeft
              onClick={() => handlePlayerClose(songId, songName, artistName)}
              className="text-xl cursor-pointer"
            />
          </div>
          <div className="flex md:flex-row h-full flex-col items-center justify-evenly">
            <div className="transition-all md:mb-0 mb-5 px-3 py-5 md:w-[50%] w-full flex justify-center">
              <img
                src={`${import.meta.env.VITE_BASEURL}/assets${image}`}
                alt="Album Art"
                className="transition-all w-[80%]  rounded-3xl"
              />
            </div>
            <div className="transition-all flex items-center justify-center md:w-[60%]">
              <div className="md:rounded-3xl w-full md:p-2 md:border-2 md:border-white/20">
                <div className="flex items-center px-3 justify-between">
                  <div className="flex flex-col">
                    <div
                      title={songName}
                      className="font-extrabold md:leading-[50px] line-clamp-2 md:text-4xl text-3xl"
                    >
                      {songName}
                    </div>
                    <span className="md:text-xl capitalize font-thin text-lg text-gray-100">
                      {artistName}
                    </span>
                  </div>
                  <div
                    onClick={handleToggle}
                    className="h-full flex items-center justify-end cursor-pointer"
                  >
                    {isLiked ? (
                      <FaHeart className="md:text-4xl active:scale-75  transition-all text-3xl text-red-500" />
                    ) : (
                      <FiHeart className="md:text-4xl active:scale-75  transition-all text-3xl" />
                    )}
                  </div>
                </div>
                <div className="px-3 mt-5">
                  <div className="flex items-center justify-between text-sm text-gray-200">
                    <span>
                      {isLoading ? "Buffering..." : formatTime(currentTime)}
                    </span>
                    <span>{formatTime(totalDuration)}</span>
                  </div>
                  <div
                    className="relative w-full h-2 bg-white/20 rounded-lg mt-2 cursor-pointer"
                    ref={progressBarRef}
                    onMouseDown={handleStart}
                    onTouchStart={handleStart}
                  >
                    <div
                      className="absolute top-0 left-0 h-2 bg-orange-500 rounded-lg"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                    <div
                      className="absolute top-1/2 transform -translate-y-1/2 bg-white w-4 h-4 rounded-full cursor-pointer"
                      style={{ left: `${progressPercentage - 1}%` }}
                      draggable="false"
                    ></div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-5 mt-5">
                  <button className="p-3 rounded-full">
                    <PiShuffle className="text-white md:text-lg text-3xl" />
                  </button>
                  <button
                    onClick={() => handlePrevSong(songId)}
                    className="p-3 rounded-full"
                  >
                    <FaBackward className="text-white text-3xl" />
                  </button>
                  <button
                    className="p-3 bg-orange-500 rounded-full"
                    onClick={togglePlay}
                  >
                    {isPlaying ? (
                      <FaPause className="text-white text-lg" />
                    ) : (
                      <FaPlay className="text-white text-lg" />
                    )}
                  </button>
                  <button
                    onClick={() => handleNextSong(songId)}
                    className={`p-3 rounded-full ${songId}`}
                  >
                    <FaForward className="text-white text-3xl" />
                  </button>
                  <button onClick={toggleMute} className="p-3 rounded-full">
                    {isMuted ? (
                      <HiSpeakerXMark className="text-white md:text-lg text-3xl" />
                    ) : (
                      <HiSpeakerWave className="text-white md:text-lg text-3xl" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* {isLoading && (
          <div className="absolute top-0 left-0 w-full h-full backdrop-blur-lg flex items-center justify-center">
            <div className="flex items-center  rounded-3xl w-[300px] h-[200px] justify-center space-x-1">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="bg-indigo-500 h-8 w-2 animate-wave rounded-full"
                  style={{
                    animationDelay: `${index * 0.2}s`,
                  }}
                ></div>
              ))}
            </div>
          </div>
        )} */}
      </div>
      <audio
        ref={audioRef}
        src={`${import.meta.env.VITE_BASEURL}${audioUrl}`}
        preload="auto"
        onLoadedMetadata={handleLoadedMetadata}
      />
    </div>
  );
};

export default MusicPlayer;
