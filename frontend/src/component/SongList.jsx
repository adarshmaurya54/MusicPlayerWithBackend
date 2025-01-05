import React, { useState } from "react";
import { FaHeart, FaPlay } from "react-icons/fa";

function SongList({ id, title, artist, poster, handlePlayer }) {
  const [favorite, setFavorite] = useState(false);

  const handleFavorite = () => {
    setFavorite(!favorite);
  };

  return (
    // <div className="bg-white backdrop-blur-lg mt-3 hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col p-2 rounded-[20px]">
    //   <div className="flex text-center justify-between flex-col">
    //     <div>
    //       <div className="text-black mt-3">
    //         <h1 className="font-bold font-poppins truncate text-lg">{title}</h1>
    //         <h6 className="text-gray-600 truncate font-light">{artist}</h6>
    //       </div>
    //       <div className="flex justify-center mt-4 gap-2">
    //         <div
    //           onClick={() => handleFavorite()}
    //           className={`flex text-3xl justify-center items-center ${
    //             favorite ? "text-red-600" : "text-black"
    //           }`}
    //         >
    //           <FaHeart />
    //         </div>
    //       </div>
    //     </div>
    //     <div
    //       
    //       className="text-white flex items-center justify-center gap-1 mt-4 p-2 rounded-b-xl rounded-t-md text-center font-bold bg-black"
    //     >
    //       <FaPlay />
    //       Play
    //     </div>
    //   </div>
    // </div>
    <div onClick={() => handlePlayer(id)} className="bg-white border-2 cursor-pointer border-black/10 hover:shadow-md rounded-lg overflow-hidden dark:bg-zinc-900">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center">
          <svg
            className="h-6 w-6 text-yellow-500"
            fill="none"
            height="24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9 18V5l12-2v13"></path>
            <circle cx="6" cy="18" r="3"></circle>
            <circle cx="18" cy="16" r="3"></circle>
          </svg>
          <div className="mx-7">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">
              {title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">{artist}</p>
          </div>
        </div>
        <div className="flex items-center">
          <svg
            onClick={() => handleFavorite()}
            className="h-6 w-6 text-red-500"
            fill={`${favorite ? "#ef4444": "none"}`}
            height="24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
          </svg>
          <svg
            className="h-6 w-6 text-gray-500 dark:text-gray-400 ml-4"
            fill="none"
            height="24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default SongList;
