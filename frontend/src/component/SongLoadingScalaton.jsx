import React from "react";

function SongLoadingScalaton() {
  return (
    <>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 animate-pulse md:grid-cols-3 gap-2 mt-5">
        <div className="h-24 md:bg-gray-200 bg-white rounded-xl"></div>
        <div className="h-24 md:bg-gray-200 bg-white rounded-xl"></div>
        <div className="h-24 md:bg-gray-200 bg-white rounded-xl"></div>
        <div className="h-24 md:bg-gray-200 bg-white rounded-xl"></div>
        <div className="h-24 md:bg-gray-200 bg-white rounded-xl"></div>
        <div className="h-24 md:bg-gray-200 bg-white rounded-xl"></div>
        <div className="h-24 md:bg-gray-200 bg-white rounded-xl"></div>
        <div className="h-24 md:bg-gray-200 bg-white rounded-xl"></div>
      </div>
      <div className="flex py-3 bg-white rounded-xl md:justify-center justify-evenly mt-4 items-center animate-pulse">
        <div disabled="" className="rounded-lg text-black">
          <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
        </div>
        <div>
          <div className="flex items-center space-x-2 md:px-4 py-2">
            <div className="p-4 border rounded-lg bg-gray-200 text-white"></div>
            <div className="p-4 border rounded-lg bg-gray-200 text-white"></div>
            <div className="p-1 border rounded-full bg-gray-200 text-white"></div>
            <div className="p-1 border rounded-full bg-gray-200 text-white"></div>
            <div className="p-1 border rounded-full bg-gray-200 text-white"></div>
            <div className="p-4 border rounded-lg bg-gray-200 text-white"></div>
          </div>
        </div>
        <div className="text-black">
          <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </>
  );
}

export default SongLoadingScalaton;
