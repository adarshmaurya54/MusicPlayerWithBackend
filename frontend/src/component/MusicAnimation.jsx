import React from 'react';

function MusicAnimation({isPlaying}) {
  return (
    <div className="flex bg-black/20  w-full h-full justify-center items-center">
      <div className="wave flex items-center h-[30px] gap-1">
        <div className={`bg-white w-[4px] ${isPlaying ? 'h-7 animate-wave1':'h-4'} `}></div>
        <div className={`bg-white w-[4px] ${isPlaying ? 'h-7 animate-wave2':'h-2'} `}></div>
        <div className={`bg-white w-[4px] ${isPlaying ? 'h-7 animate-wave3':'h-3'} `}></div>
        <div className={`bg-white w-[4px] ${isPlaying ? 'h-7 animate-wave4':'h-5'} `}></div>
        <div className={`bg-white w-[4px] ${isPlaying ? 'h-7 animate-wave2':'h-2'} `}></div>
      </div>
    </div>
  );
}

export default MusicAnimation;
