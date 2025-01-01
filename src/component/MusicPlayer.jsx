import React, { useState, useRef, useEffect } from "react";
import { FaArrowLeft, FaPlay, FaPause } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { PiShuffle } from "react-icons/pi";
import { FaChevronUp } from "react-icons/fa";
import { FaForward } from "react-icons/fa";
import { FaBackward } from "react-icons/fa";

const MusicPlayer = ({
  songName,
  playNextSong,
  playPrevSong,
  artistName,
  image,
  handlePlayerClose,
  songId,
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // New state for loading
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

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
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  const handleNextSong = () => {
    if (playNextSong) {
      playNextSong();
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
  
  const handlePrevSong = () => {
    if (playPrevSong) {
      playPrevSong();
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
        className="transition-all duration-700 md:w-[80%] relative md:h-[98%] bg-no-repeat bg-center bg-cover overflow-auto no-scrollbar h-full w-full bg-white/20 md:rounded-[30px]"
      >
        <div className="bg-black/20 p-4 h-full overflow-auto no-scrollbar backdrop-blur-md">
          <div className="flex absolute top-7 left-7 justify-between items-center">
            <FaArrowLeft
              onClick={() => handlePlayerClose()}
              className="text-xl cursor-pointer"
            />
          </div>
          <div className="flex md:flex-row flex-col items-center justify-center">
            <div className="transition-all md:mb-0 mb-5 px-3 py-5 md:w-[50%] flex justify-center">
              <img
                src={image}
                alt="Album Art"
                className="transition-all h-full w-[80%] rounded-xl"
              />
            </div>
            <div className="transition-all overflow-auto no-scrollbar md:w-[60%] h-full">
              <div className="md:rounded-3xl md:p-2 md:border-2 md:border-white/20 mb-5">
                <div className="flex items-center px-3 justify-between">
                  <div className="flex flex-col">
                    <span className="font-extrabold md:text-4xl text-3xl">
                      {songName}
                    </span>
                    <span className="md:text-xl font-thin text-lg text-gray-100">
                      {artistName}
                    </span>
                  </div>
                  <CiHeart className="md:text-5xl cursor-pointer text-3xl" />
                </div>
                <div className="px-3 mt-5">
                  <div className="flex items-center justify-between text-sm text-gray-200">
                    <span>
                      {isLoading ? "Loading..." : formatTime(currentTime)}
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
                      className="absolute top-1/2 transform -translate-y-1/2 bg-white outline outline-1 outline-white outline-offset-2 w-4 h-4 rounded-full cursor-pointer"
                      style={{ left: `${progressPercentage - 3}%` }}
                      draggable="false"
                    ></div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-5 mt-5">
                  <button className="p-3 rounded-full">
                    <PiShuffle className="text-white md:text-lg text-3xl" />
                  </button>
                  <button
                    onClick={() => handlePrevSong()}
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
                    onClick={() => handleNextSong()}
                    className="p-3 rounded-full"
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
              <div className="flex flex-col cursor-pointer justify-center items-center mb-5">
                <FaChevronUp className="text-xl md:hidden" />
                <span className="font-bold font-roboto uppercase text-xl">
                  Lyrics
                </span>
              </div>
              <div className="text-center text-3xl overflow-auto no-scrollbar h-[200px] bg-white/20 rounded-3xl p-5">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Corporis rerum fuga ipsa necessitatibus harum temporibus eos
                consectetur sed fugiat molestias magnam quis eius quaerat enim
                ullam hic excepturi, quasi assumenda!
              </div>
            </div>
          </div>
        </div>
      </div>
      <audio
        ref={audioRef}
        src={`/assets/audio/${songId}.mp3`}
        preload="auto"
        onLoadedMetadata={handleLoadedMetadata}
      />
    </div>
  );
};

export default MusicPlayer;
