import React from "react";

function SongLoadingScalaton() {
  return (
    <div className="flex bg-[url(./bg.jpg)] bg-no-repeat bg-center bg-fixed bg-cover flex-col gap-4 md:p-10 ">
      <div className="md:p-0 p-4">
        <div className="bg-white rounded-2xl flex md:flex-row flex-col gap-3 justify-between md:border p-5 md:rounded-2xl animate-pulse">
          <div className="flex justify-between w-[200px] md:w-[500px]">
            <div className="md:w-[48%] w-full h-10 bg-gray-200 rounded-xl"></div>
          </div>
          <div className="flex gap-3">
            <div className="h-10 md:w-[150px] w-1/2 bg-gray-200 rounded-xl"></div>
            <div className="h-10 md:w-[100px] w-1/2 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
      <div className="md:bg-white md:border p-4 pb-5 rounded-2xl md:rounded-2xl animate-pulse">
        <div className="flex justify-between md:w-[500px]">
          <div className="md:w-[78%] w-full h-12 bg-gray-200 rounded-xl"></div>
        </div>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-5">
          <div className="h-24 bg-gray-200 rounded-xl"></div>
          <div className="h-24 bg-gray-200 rounded-xl"></div>
          <div className="h-24 bg-gray-200 rounded-xl"></div>
          <div className="h-24 bg-gray-200 rounded-xl"></div>
          <div className="h-24 bg-gray-200 rounded-xl"></div>
          <div className="h-24 bg-gray-200 rounded-xl"></div>
          <div className="h-24 bg-gray-200 rounded-xl"></div>
          <div className="h-24 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}

export default SongLoadingScalaton;
