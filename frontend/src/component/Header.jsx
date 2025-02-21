import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineLogin } from "react-icons/ai";
import { IoMdLogOut } from "react-icons/io";
import { LuCloudUpload } from "react-icons/lu";
import axios from "axios"; // Import Axios
import logo from "../assets/icon.png";
import useTheme from "../context/theme";
import { RxHamburgerMenu } from "react-icons/rx";
import { LiaTimesSolid } from "react-icons/lia";



const Header = ({ handleToggleUpload }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track if user is authenticated
  const [hamb, setHamb] = useState(false);
  const navigate = useNavigate();
  const { darkTheme, lightTheme } = useTheme();

  // Get the base URL from the environment variables
  const baseUrl = import.meta.env.VITE_BASEURL; // This will use the VITE_BASE_URL variable from .env

  // Check if the token is valid
  const checkTokenValidity = async (token) => {
    try {
      // Make a request using Axios
      const response = await axios.post(
        `${baseUrl}/validate-token`, // Use the base URL with the validate-token endpoint
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        localStorage.removeItem("token"); // Remove invalid token
      }
    } catch (error) {
      console.error("Error validating token:", error);
      setIsAuthenticated(false);
      localStorage.removeItem("token"); // Handle error and remove token
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      checkTokenValidity(token); // Check token validity on component mount
    } else {
      setIsAuthenticated(false); // No token means user is not authenticated
    }
  }, []); // Empty dependency array to run once on mount

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear the token
    setIsAuthenticated(false); // Set authentication state to false
    navigate("/"); // Redirect to login page
  };

  return (
    <header className="z-30 md:px-10 px-4  py-5">
      <div className={`dark:border-white/10 border transition-all md:h-auto overflow-y-hidden p-5 rounded-3xl bg-white dark:bg-slate-900 backdrop-blur-lg flex md:flex-row flex-col justify-between md:items-center gap-4`}>
        <h1 className="md:text-3xl flex items-center justify-between text-xl font-bold">
          <Link to="/" className="flex gap-3 items-center">
            <img src={logo} alt="./vite.svg" className="md:w-14 w-9" />
            <span className="dark:text-white text-black">PlayBeatz</span>
          </Link>
          {!hamb && <RxHamburgerMenu onClick={() => setHamb(true)} className="dark:text-white cursor-pointer md:hidden text-3xl" />}
          {hamb && <LiaTimesSolid onClick={() => setHamb(false)}  className="dark:text-white cursor-pointer md:hidden text-3xl"/>}
        </h1>
        {handleToggleUpload && (
          <nav className={`${hamb ? "flex" : "hidden md:flex"} flex text-xs md:text-base items-center gap-4`}>
            {isAuthenticated ? (
              <>
                <button
                  onClick={handleToggleUpload}
                  className="bg-black dark:bg-white hover:ring-2 hover:ring-black
           ring-offset-2 dark:ring-offset-0  transition-all duration-300 md:w-auto w-[50%] flex items-center gap-2 dark:text-black text-white px-4 py-2 rounded-xl"
                >
                  <LuCloudUpload className="mt-1" />
                  <span>Upload Song</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-black dark:bg-white hover:ring-2 hover:ring-black
           ring-offset-2 dark:ring-offset-0  transition-all duration-300 md:w-auto w-[50%] justify-center flex items-center gap-2 dark:text-black text-white px-4 py-2 rounded-xl"
                >
                  <IoMdLogOut className="mt-1" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="bg-black dark:bg-white hover:ring-2 hover:ring-black
           dark:ring-offset-0 ring-offset-2 transition-all duration-300 md:w-auto w-[50%] justify-center flex items-center gap-2 dark:text-black text-white px-4 py-2 rounded-xl"
              >
                <AiOutlineLogin className="mt-1" />
                <span>Admin Login</span>
              </button>
            )}
            <svg
              onClick={() => darkTheme()}
              className="w-7 h-7 dark:hidden cursor-pointer"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                className="stroke-black"
              ></path>
              <path
                d="M12 4v1M17.66 6.344l-.828.828M20.005 12.004h-1M17.66 17.664l-.828-.828M12 20.01V19M6.34 17.664l.835-.836M3.995 12.004h1.01M6 6l.835.836"
                className="stroke-black"
              ></path>
            </svg>
            <svg
              onClick={() => lightTheme()}
              className="w-7 h-7 hidden dark:block cursor-pointer"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17.715 15.15A6.5 6.5 0 0 1 9 6.035C6.106 6.922 4 9.645 4 12.867c0 3.94 3.153 7.136 7.042 7.136 3.101 0 5.734-2.032 6.673-4.853Z"
                className=""
              ></path>
              <path
                d="m17.715 15.15.95.316a1 1 0 0 0-1.445-1.185l.495.869ZM9 6.035l.846.534a1 1 0 0 0-1.14-1.49L9 6.035Zm8.221 8.246a5.47 5.47 0 0 1-2.72.718v2a7.47 7.47 0 0 0 3.71-.98l-.99-1.738Zm-2.72.718A5.5 5.5 0 0 1 9 9.5H7a7.5 7.5 0 0 0 7.5 7.5v-2ZM9 9.5c0-1.079.31-2.082.845-2.93L8.153 5.5A7.47 7.47 0 0 0 7 9.5h2Zm-4 3.368C5 10.089 6.815 7.75 9.292 6.99L8.706 5.08C5.397 6.094 3 9.201 3 12.867h2Zm6.042 6.136C7.718 19.003 5 16.268 5 12.867H3c0 4.48 3.588 8.136 8.042 8.136v-2Zm5.725-4.17c-.81 2.433-3.074 4.17-5.725 4.17v2c3.552 0 6.553-2.327 7.622-5.537l-1.897-.632Z"
                className="fill-black dark:fill-white"
              ></path>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17 3a1 1 0 0 1 1 1 2 2 0 0 0 2 2 1 1 0 1 1 0 2 2 2 0 0 0-2 2 1 1 0 1 1-2 0 2 2 0 0 0-2-2 1 1 0 1 1 0-2 2 2 0 0 0 2-2 1 1 0 0 1 1-1Z"
                className="fill-black dark:fill-white"
              ></path>
            </svg>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
