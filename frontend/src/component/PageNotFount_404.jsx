import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

const PageNotFount_404 = () => {
  return (
    <div
      className={`flex justify-center md:p-7 pt-20 px-7 text-white items-center bg-[url(/src/assets/404.png)] bg-center bg-cover bg-no-repeat h-[100vh]`}
    >
      <div className="flex items-center bg-black/20 backdrop-blur-md p-10 rounded-3xl flex-col">
        <span className="font-sofia text-5xl mb-3 font-light">404</span>
        <h1 className="font-sofia text-center mb-3 text-6xl font-bold">
          Page not found
        </h1>
        <p className="text-sm text-center font-light mb-3">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <Link to="/" className="flex items-center border p-2 mt-3 rounded-xl gap-3">
          <FaArrowLeft className="inline" /> Back to home
        </Link>
      </div>
    </div>
  );
};

export default PageNotFount_404;
