import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const NoSongFound = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <img src="/404.jpg" alt="404" className="md:w-96 w-80" />
      <h1 className="md:text-5xl text-center text-3xl font-bold text-gray-800 my-4">Song Not Found</h1>
      <p className="text-gray-500 text-center md:text-lg text-xs md:p-0 px-10 mb-6">
        The song you're looking for doesn't exist or has been removed.
      </p>

      <div onClick={() => navigate("/")} className="cursor-pointer border hover:bg-black hover:text-white p-3 rounded-xl flex gap-4 justify-center item-center">
        <FaArrowLeft
          
          className="text-xl h-full cursor-pointer"
        />
        <div className="inline-block">Go Back to Home</div>
      </div>
    </div>
  );
};

export default NoSongFound;
