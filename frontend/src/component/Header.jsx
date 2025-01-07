import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineLogin } from "react-icons/ai";
import { IoMdLogOut } from "react-icons/io";
import { LuCloudUpload } from "react-icons/lu";
import axios from "axios"; // Import Axios

const Header = ({ handleToggleUpload }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track if user is authenticated
  const navigate = useNavigate();

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
    <header className="sticky z-30 top-0 md:px-10 px-4 py-5">
      <div className="border p-5 rounded-2xl bg-white backdrop-blur-lg flex md:flex-row flex-col justify-between md:items-center gap-4">
        <h1 className="text-3xl font-bold">
          <Link to="/">PlayMusic</Link>
        </h1>
        <nav>
          {isAuthenticated ? (
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
            <button
              onClick={() => navigate("/login")}
              className="bg-black md:w-auto w-[50%] justify-center flex items-center gap-2 text-white px-4 py-2 rounded-xl"
            >
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
