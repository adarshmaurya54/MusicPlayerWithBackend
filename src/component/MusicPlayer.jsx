import React, { useState, useRef, useEffect } from "react";
import { FaArrowLeft, FaPlay, FaPause } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { CiHeart } from "react-icons/ci";
import {
  TbPlayerSkipBackFilled,
  TbPlayerSkipForwardFilled,
} from "react-icons/tb";
import { HiSpeakerWave } from "react-icons/hi2";
import { PiShuffle } from "react-icons/pi";
import { FaChevronUp } from "react-icons/fa";

const MusicPlayer = ({
  songName,
  artistName,
  image,
  handlePlayerClose,
  songId, // Assuming songId is passed down as a prop
}) => {
  const [currentTime, setCurrentTime] = useState(0); // Current time in seconds
  const [totalDuration, setTotalDuration] = useState(0); // Total duration of the song
  const [isPlaying, setIsPlaying] = useState(false); // Track whether the song is playing
  const [isDragging, setIsDragging] = useState(false); // Dragging state
  const audioRef = useRef(null); // Audio element reference
  const progressBarRef = useRef(null); // Reference for the progress bar

  const progressPercentage = (currentTime / totalDuration) * 100;

  // Format seconds into mm:ss format
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Common function to handle dragging on mouse or touch
  const updateProgress = (clientX) => {
    if (!progressBarRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const offsetX = Math.min(Math.max(0, clientX - rect.left), rect.width);
    const newTime = (offsetX / rect.width) * totalDuration;
    setCurrentTime(newTime);
    if (audioRef.current) audioRef.current.currentTime = newTime;
  };

  // Handle mouse or touch move
  const handleMove = (e) => {
    if (!isDragging) return;

    if (e.type === "mousemove") {
      updateProgress(e.clientX);
    } else if (e.type === "touchmove") {
      updateProgress(e.touches[0].clientX);
    }
  };

  // Handle mouse or touch start
  const handleStart = (e) => {
    setIsDragging(true);

    if (e.type === "mousedown") {
      updateProgress(e.clientX);
    } else if (e.type === "touchstart") {
      updateProgress(e.touches[0].clientX);
    }
  };

  // Handle mouse or touch end
  const handleEnd = () => {
    setIsDragging(false);
  };

  // Handle Play/Pause
  const togglePlay = () => {
    if (!audioRef.current) {
      console.error(
        "Audio reference is null. Ensure the <audio> tag is properly rendered."
      );
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((error) => {
        console.error("Error while trying to play the audio:", error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  // Sync the progress bar with audio playback
  useEffect(() => {
    const updateCurrentTime = () => {
      setCurrentTime(audioRef.current.currentTime);
    };

    if (audioRef.current) {
      audioRef.current.addEventListener("timeupdate", updateCurrentTime);
      audioRef.current.addEventListener("ended", () => setIsPlaying(false));
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", updateCurrentTime);
      }
    };
  }, []);

  // Load total duration from the audio file
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setTotalDuration(audioRef.current.duration);
    }
  };

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center text-white items-center"
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
    >
      <div
        style={{ backgroundImage: `url(${image})` }}
        className="md:w-[80%] md:h-[98%]  bg-no-repeat bg-center bg-cover overflow-auto no-scrollbar h-full w-full bg-white/20 md:rounded-3xl"
      >
        <div className="bg-black/20 h-full backdrop-blur-md">
          <div className="p-4 py-8 md:py-4">
            {/* Header */}
            <div className="flex justify-between items-center">
              <FaArrowLeft
                onClick={() => handlePlayerClose()}
                className="text-xl cursor-pointer"
              />
              <p className="font-bold text-xl">Now Playing</p>
              <BsThreeDots className="text-xl cursor-pointer" />
            </div>
            <div className="flex md:flex-row flex-col py-10 items-center justify-center">
              {/* Album Image */}
              <div className="transition-all md:mb-0 mb-5 px-3 py-5 md:w-[50%] flex justify-center">
                <img
                  src={image}
                  alt="Album Art"
                  className="h-full w-[70%] rounded-xl"
                />
              </div>

              <div className="md:w-[60%] overflow-auto">
                {/* Song Info */}
                <div className="flex items-center px-3 justify-between">
                  <div className="flex flex-col">
                    <span className="font-extrabold md:text-xl text-3xl">
                      {songName}
                    </span>
                    <span className="md:text-sm font-thin text-lg text-gray-100">
                      {artistName}
                    </span>
                  </div>
                  <CiHeart className="md:text-2xl cursor-pointer text-3xl" />
                </div>

                {/* Progress Tracker */}
                <div className="px-3 mt-5">
                  <div className="flex items-center justify-between text-sm text-gray-200">
                    <span>{formatTime(currentTime)}</span>
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
                      style={{ left: `${progressPercentage}%` }}
                      draggable="false"
                    ></div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-5 mt-5">
                  <button className="p-3 rounded-full">
                    <PiShuffle className="text-white md:text-lg text-3xl" />
                  </button>
                  <button className="p-3 rounded-full">
                    <TbPlayerSkipBackFilled className="text-white text-3xl" />
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
                  <button className="p-3 rounded-full">
                    <TbPlayerSkipForwardFilled className="text-white text-3xl" />
                  </button>
                  <button className="p-3 rounded-full">
                    <HiSpeakerWave className="text-white md:text-lg text-3xl" />
                  </button>
                </div>
                <div className="text-center bg-white/20 md:rounded-[30px] md:rounded-b-none rounded-[50px] rounded-b-none p-5">
                  <div className="flex flex-col cursor-pointer justify-center items-center mb-5">
                    <FaChevronUp className="text-xl md:hidden" />
                    <span className="font-light">Lyrics</span>
                  </div>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Corporis rerum fuga ipsa necessitatibus harum temporibus eos
                  consectetur sed fugiat molestias magnam quis eius quaerat enim
                  ullam hic excepturi, quasi assumenda!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Audio Player */}
      <audio
        ref={audioRef}
        src={`/src/assets/audio/${songId}.mp3`} // Use songId to find the corresponding audio file
        preload="auto"
        onLoadedMetadata={handleLoadedMetadata} // Get total duration when metadata is loaded
      />
 