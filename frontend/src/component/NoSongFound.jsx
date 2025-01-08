import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const NoSongFound = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <img src="/404.jpg" alt="404" className="w-96" />
      <h1 className="text-5xl font-bold text-gray-800 my-4">Song Not Found</h1>
      <p className="text-gray-600 text-lg mb-6">
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
