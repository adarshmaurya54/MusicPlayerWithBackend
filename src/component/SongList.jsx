import React, { useState } from "react";
import { FaHeart, FaPlay } from "react-icons/fa";

function SongList({ id, title, artist, poster, handlePlayer }) {
  const [favorite, setFavorite] = useState(false);

  const handleFavorite = () => {
    setFavorite(!favorite);
  };

  return (
    <div onClick={() => handlePlayer(id)} className="bg-white border-2 backdrop-blur-lg mt-3 hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col p-2 rounded-[20px]">
      <img
        src={poster}
        alt={title}
        className="md:h-[60%] object-cover rounded-xl"
      />
      <div className="flex justify-between flex-col">
        <div>
          <div className="text-black mt-3">
            <h1 className="font-bold font-poppins truncate text-lg">{title}</h1>
            <h6 className="text-gray-600 truncate font-light">{artist}</h6>
          </div>
          <div className="flex mt-4 gap-2">
            <div
              onClick={() => handleFavorite()}
              className={`flex text-sm justify-center items-center ${
                favorite ? "text-red-600" : "text-black"
              }`}
            >
              <FaHeart />
            </div>
            <div className="flex gap-1 text-sm justify-center items-center ">
              <FaPlay className="text-black"/>
              <span className="text-gray-600">1.2k</span>
            </div>
          </div>
        </div>
        <div className="text-white flex items-center justify-center gap-1 mt-4 p-2 rounded-b-xl rounded-t-md text-center font-bold bg-black">
          <FaPlay />
          Play
        </div>
      </div>
    </div>
  );
}

export default SongList;
