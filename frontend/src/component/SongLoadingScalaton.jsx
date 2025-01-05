import React from "react";

function SongLoadingScalaton() {
  return (
    <div class="bg-white border p-4 pb-5 md:rounded-2xl animate-pulse">
      <div class="flex justify-between md:w-[500px]">
        <div class="md:w-[78%] w-full h-10 bg-gray-200 rounded-xl"></div>
      </div>
      <div class="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-5">
        <div class="h-10 bg-gray-200 rounded"></div>
        <div class="h-10 bg-gray-200 rounded"></div>
        <div class="h-10 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

export default SongLoadingScalaton;
