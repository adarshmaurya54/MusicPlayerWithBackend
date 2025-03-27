import React from 'react';

function MusicAnimation({ isPlaying, extraClassForWave='bg-white',extraClassForContainer }) {
  return (

    <div className={`wave flex items-center h-[30px] gap-1 ${extraClassForContainer}`}>
      <div style={{ animationPlayState: `${isPlaying ? "running" : "paused"}` }} className={`${extraClassForWave} w-[4px] animate-wave1 h-4`}></div>
      <div style={{ animationPlayState: `${isPlaying ? "running" : "paused"}` }} className={`${extraClassForWave} w-[4px] animate-wave2 h-2`}></div>
      <div style={{ animationPlayState: `${isPlaying ? "running" : "paused"}` }} className={`${extraClassForWave} w-[4px] animate-wave3 h-3`}></div>
      <div style={{ animationPlayState: `${isPlaying ? "running" : "paused"}` }} className={`${extraClassForWave} w-[4px] animate-wave4 h-5`}></div>
      <div style={{ animationPlayState: `${isPlaying ? "running" : "paused"}` }} className={`${extraClassForWave} w-[4px] animate-wave2 h-2`}></div>
    </div>
  );
}

export default MusicAnimation;
