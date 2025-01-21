import React from 'react';

function MusicAnimation() {
  return (
    <div className="flex justify-center items-center">
      <div className="wave flex gap-1">
        <div className="bg-gray-300 w-[2px] h-3  animate-wave1"></div>
        <div className="bg-gray-300 w-[2px] h-3  animate-wave2"></div>
        <div className="bg-gray-300 w-[2px] h-3 animate-wave3"></div>
      </div>
    </div>
  );
}

export default MusicAnimation;
