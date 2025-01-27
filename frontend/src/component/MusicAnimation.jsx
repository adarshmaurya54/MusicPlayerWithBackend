import React from 'react';

function MusicAnimation() {
  return (
    <div className="flex justify-center items-center">
      <div className="wave flex gap-1">
        <div className="bg-gray-500 w-[3px] h-5 animate-wave1"></div>
        <div className="bg-gray-500 w-[3px] h-5 animate-wave2"></div>
        <div className="bg-gray-500 w-[3px] h-5 animate-wave3"></div>
        <div className="bg-gray-500 w-[3px] h-5 animate-wave3"></div>
      </div>
    </div>
  );
}

export default MusicAnimation;
