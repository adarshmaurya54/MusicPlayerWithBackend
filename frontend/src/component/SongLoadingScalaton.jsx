import React from "react";

function SongLoadingScalaton() {
  const skeletons = Array(8).fill(0);
  return (
    <>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-5">
        {skeletons.map((_, index) => (
          <div
            key={index}
            className="relative group flex flex-col space-y-2 bg-white border border-gray-200 shadow-lg rounded-xl p-4 animate-pulse"
          >
            <div className="flex w-full h-full space-x-4 items-center">
              {/* Image placeholder */}
              <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-md bg-gray-300">
                <svg
                  className="h-8 w-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 18V5l12-2v13"></path>
                  <circle cx="6" cy="18" r="3"></circle>
                  <circle cx="18" cy="16" r="3"></circle>
                </svg>
              </div>
              {/* Title and artist placeholders */}
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
              {/* Heart icon placeholder */}
              <div className="w-6 h-6 rounded-full">
                <svg
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                </svg>
              </div>
            </div>
          </div>
        ))}
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
