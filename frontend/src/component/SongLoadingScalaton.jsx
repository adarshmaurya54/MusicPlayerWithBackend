import React from "react";

function SongLoadingScalaton() {
  return (
    <div className="bg-white border p-4 pb-5 md:rounded-2xl animate-pulse">
      <div className="flex justify-between md:w-[500px]">
        <div className="md:w-[78%] w-full h-10 bg-gray-200 rounded-xl"></div>
      </div>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-5">
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

export default SongLoadingScalaton;
