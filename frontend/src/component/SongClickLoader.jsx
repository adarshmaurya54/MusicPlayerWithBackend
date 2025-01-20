import React from "react";

function SongClickLoader() {
  return (
    <div className="fixed z-50 top-0 left-0 w-full backdrop-blur-md h-full flex justify-center items-center">
      <div className="transition-all duration-700 md:w-[90%] border relative md:h-[95%] bg-white overflow-auto no-scrollbar h-full w-full md:rounded-[30px]">
        <div className="p-4 h-full overflow-auto no-scrollbar">
          <div className="flex absolute md:top-7 md:left-7 justify-between items-center">
            <div className="w-8 h-8 bg-gray-500 animate-pulse rounded-full"></div>
          </div>
          <div className="flex md:flex-row h-full flex-col items-center justify-around">
            {/* Skeleton for Image */}
            <div className="transition-all md:mb-0 mb-5 px-3 py-5 md:w-[50%] w-full flex justify-center">
              <div className="md:w-[80%] w-[270px] h-[200px] md:h-[300px] bg-gray-500 animate-pulse rounded-3xl"></div>
            </div>
            {/* Skeleton for Song Info */}
            <div className="transition-all flex items-center justify-center md:w-[60%] w-full">
              <div className="md:rounded-3xl w-full md:p-2 md:py-4 md:border-2 md:border-black/20">
                <div className="flex items-center px-3 justify-between">
                  <div className="flex flex-col gap-2">
                    <div className="w-40 h-8 bg-gray-500 animate-pulse rounded"></div>
                    <div className="w-32 h-5 bg-gray-500 animate-pulse rounded"></div>
                  </div>
                  <div className="w-8 h-8 bg-gray-500 animate-pulse rounded-full"></div>
                </div>
                <div className="px-3 mt-5">
                  <div className="flex items-center justify-between text-sm text-gray-200">
                    <div className="w-16 h-4 bg-gray-500 animate-pulse rounded"></div>
                    <div className="w-16 h-4 bg-gray-500 animate-pulse rounded"></div>
                  </div>
                  <div className="relative w-full h-2 bg-gray-500 rounded-lg mt-2">
                    <div className="absolute top-1/2 transform -translate-y-1/2 bg-gray-500 w-4 h-4 rounded-full"></div>
                  </div>
                </div>
                <div className="flex items-center md:justify-center justify-evenly gap-5 mt-5">
                  <div
                    className="p-3 rounded-full bg-gray-500 animate-pulse w-[30px] h-[30px]"
                  ></div>
                  <div
                    className="p-3 rounded-full bg-gray-500 animate-pulse w-[40px] h-[40px]"
                  ></div>
                  <div
                    className="p-3 rounded-full bg-gray-500 animate-pulse md:w-[50px] md:h-[50px] w-[60px] h-[60px]"
                  ></div>
                  <div
                    className="p-3 rounded-full bg-gray-500 animate-pulse w-[40px] h-[40px]"
                  ></div>
                  <div
                    className="p-3 rounded-full bg-gray-500 animate-pulse w-[30px] h-[30px]"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SongClickLoader;
