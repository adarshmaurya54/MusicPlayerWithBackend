import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineLogin } from "react-icons/ai";
import { IoMdLogOut } from "react-icons/io";
import { LuCloudUpload } from "react-icons/lu";

const Header = ({ handleToggleUpload }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // Check if the user is logged in

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear the token
    navigate("/login"); // Redirect to login page
  };

  return (
    <header className="sticky top-0 p-5">
      <div className="border p-5 rounded-3xl bg-white backdrop-blur-lg flex md:flex-row flex-col justify-between md:items-center gap-4">
        <h1 className="text-3xl font-bold">
          <Link to="/">PlayMusic</Link>
        </h1>
        <nav>
          {token ? (
            <div className="flex items-center gap-4">
              <button
                onClick={handleToggleUpload}
                className="bg-black md:w-auto w-[50%] flex items-center gap-2 text-white px-4 py-2 rounded-xl"
              >
                <LuCloudUpload className="mt-1" />
                <span>Upload Song</span>
              </button>
              <button
                onClick={handleLogout}
                className="bg-black md:w-auto w-[50%] justify-center flex items-center gap-2 text-white px-4 py-2 rounded-xl"
              >
                <IoMdLogOut className="mt-1" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button onClick={() => navigate("/login")} className="bg-black md:w-auto w-[50%] justify-center flex items-center gap-2 text-white px-4 py-2 rounded-xl">
              <AiOutlineLogin className="mt-1" />
              <span>Login</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
