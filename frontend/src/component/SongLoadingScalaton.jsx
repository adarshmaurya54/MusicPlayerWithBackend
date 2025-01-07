import React from "react";

function SongLoadingScalaton() {
  return (
    <div className="flex flex-col gap-4 md:p-10">
      <div className="bg-white flex md:flex-row flex-col gap-3 justify-between md:border p-4 pb-5 md:rounded-2xl animate-pulse">
        <div className="flex justify-between w-[200px] md:w-[500px]">
          <div className="md:w-[48%] w-full h-10 bg-gray-200 rounded-xl"></div>
        </div>
        <div className="flex gap-3">
          <div className="h-10 md:w-[150px] w-1/2 bg-gray-200 rounded"></div>
          <div className="h-10 md:w-[100px] w-1/2 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="bg-white md:border p-4 pb-5 md:rounded-2xl animate-pulse">
        <div className="flex justify-between md:w-[500px]">
          <div className="md:w-[78%] w-full h-10 bg-gray-200 rounded-xl"></div>
        </div>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-5">
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export default SongLoadingScalaton;
