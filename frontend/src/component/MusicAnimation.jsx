import React from 'react';

function MusicAnimation({isPlaying}) {
  return (
    <div className="flex bg-black/30 backdrop-blur-[5px]  w-full h-full justify-center items-center">
      <div className="wave flex items-center h-[30px] gap-1">
        <div style={{animationPlayState : `${isPlaying ? "running" : "paused"}`}} className={`bg-white w-[4px] animate-wave1 h-4`}></div>
        <div style={{animationPlayState : `${isPlaying ? "running" : "paused"}`}} className={`bg-white w-[4px] animate-wave2 h-2`}></div>
        <div style={{animationPlayState : `${isPlaying ? "running" : "paused"}`}} className={`bg-white w-[4px] animate-wave3 h-3`}></div>
        <div style={{animationPlayState : `${isPlaying ? "running" : "paused"}`}} className={`bg-white w-[4px] animate-wave4 h-5`}></div>
        <div style={{animationPlayState : `${isPlaying ? "running" : "paused"}`}} className={`bg-white w-[4px] animate-wave2 h-2`}></div>
      </div>
    </div>
  );
}

export default MusicAnimation;
