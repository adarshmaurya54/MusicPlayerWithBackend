import React from "react";
import bg from "../assets/bg.jpg";

function SongLoadingScalaton() {
  return (
    <div
      className="flex bg-no-repeat bg-center bg-fixed bg-cover flex-col gap-4 md:p-10 pb-10"
      style={{ backgroundImage: `url(${bg})` }}
    >
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
      <div className="md:bg-white md:border p-4 pb-0 rounded-2xl md:rounded-2xl animate-pulse">
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
      </div>
    </div>
  );
}

export default SongLoadingScalaton;
