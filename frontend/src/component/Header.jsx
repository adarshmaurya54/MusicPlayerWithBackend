import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineLogin } from "react-icons/ai";
import logo from "../assets/icon.png";
import { RxHamburgerMenu } from "react-icons/rx";
import { LiaTimesSolid } from "react-icons/lia";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { logout } from "../redux/features/auth/authSlice"
import { RiUploadCloud2Line } from "react-icons/ri";
import { MdLibraryMusic } from "react-icons/md";
import { toggleTheme } from '../redux/features/theme/themeSlice';
import { FaUserPlus } from "react-icons/fa";

const Header = ({ handleToggleUpload, setOpenEditProfile }) => {
  const [hamb, setHamb] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth)
  const darkMode = useSelector(state => state.theme.darkMode)

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    dispatch(logout()); // Dispatch logout action to set user to null
    toast.success("Logout successful");
  };

  return (
    <header className="z-[1] relative md:px-0 px-5 py-5">
      <div className={`dark:border-white/10 border transition-all md:h-auto p-5 rounded-3xl bg-white dark:bg-slate-900 backdrop-blur-lg flex md:flex-row flex-col justify-between md:items-center gap-4`}>
        <h1 className="md:text-3xl flex items-center justify-between text-xl font-bold">
          <Link to="/" className="flex gap-3 items-center">
            <img src={logo} alt="./vite.svg" className="md:w-14 w-9" />
            <span className="dark:text-white text-black">PlayBeatz</span>
          </Link>
          {!hamb && <RxHamburgerMenu onClick={() => setHamb(true)} className="dark:text-white cursor-pointer md:hidden text-3xl" />}
          {hamb && <LiaTimesSolid onClick={() => setHamb(false)} className="dark:text-white cursor-pointer md:hidden text-3xl" />}
        </h1>
        {handleToggleUpload && (
          <nav className={`${hamb ? "flex" : "hidden md:flex"} flex text-xs md:text-base items-center gap-4`}>
            {user ? (
              <>
                <div className="relative inline-block">
                  {/* Profile Section */}
                  <div
                    className="flex items-center space-x-3 cursor-pointer p-2 border dark:border-white/20 rounded-2xl bg-white dark:bg-slate-900"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    <img
                      src={`${import.meta.env.VITE_BASEURL}/assets/users/${user.profilePic}`} // Replace with actual image URL
                      alt="Profile"
                      className="md:w-10 md:h-10 w-7 h-7 object-cover rounded-full"
                    />
                    <span className="md:text-lg  font-semibold text-gray-900 dark:text-white">{user.name}</span>
                  </div>

                  {/* Dropdown Menu */}
                  {isOpen && (
                    <div className="absolute md:right-0 mt-2 w-48 bg-white dark:bg-slate-800 border dark:border-white/20 rounded-xl shadow-lg">
                      <ul className="p-1">
                        <li onClick={() => setOpenEditProfile(true)} className="flex items-center rounded-lg px-4 py-2 dark:text-white hover:dark:bg-gray-700 hover:bg-gray-100 cursor-pointer">
                          <FaUser className="mr-3 text-gray-400" />
                          Profile
                        </li>
                        {user.role === 'admin' &&
                          <li onClick={() => handleToggleUpload()} className="flex items-center rounded-lg px-4 py-2 dark:text-white hover:dark:bg-gray-700 hover:bg-gray-100 cursor-pointer">
                            <RiUploadCloud2Line className="mr-3 text-gray-400" />
                            Upload Song
                          </li>
                        }
                        {user.role === 'user' &&
                          <li>
                            <Link to='/library' className="flex items-center rounded-lg px-4 py-2 dark:text-white hover:dark:bg-gray-700 hover:bg-gray-100 cursor-pointer">
                              <MdLibraryMusic className="mr-3 text-gray-400" />
                              Your Library
                            </Link>
                          </li>
                        }
                        <li onClick={() => { dispatch(toggleTheme()); toast.success("Dark Mode") }} className="flex items-center px-4 py-2 rounded-lg dark:text-white dark:hover:bg-gray-700 hover:bg-gray-100 cursor-pointer">
                          {!darkMode && <svg
                            className="md:w-6 md:h-6 w-5 h-5 mr-2 -ml-[3px]"
                            viewBox="0 0 24 24"
                            fill="none"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path
                              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                              className="stroke-gray-400"
                            ></path>
                            <path
                              d="M12 4v1M17.66 6.344l-.828.828M20.005 12.004h-1M17.66 17.664l-.828-.828M12 20.01V19M6.34 17.664l.835-.836M3.995 12.004h1.01M6 6l.835.836"
                              className="stroke-gray-400"
                            ></path>
                          </svg>}
                          {darkMode && <svg
                            className="md:w-6 md:h-6 w-5 h-5 mr-2 -ml-[3px]"
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
                              className="fill-black dark:fill-gray-400"
                            ></path>
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M17 3a1 1 0 0 1 1 1 2 2 0 0 0 2 2 1 1 0 1 1 0 2 2 2 0 0 0-2 2 1 1 0 1 1-2 0 2 2 0 0 0-2-2 1 1 0 1 1 0-2 2 2 0 0 0 2-2 1 1 0 0 1 1-1Z"
                              className="fill-black dark:fill-gray-400"
                            ></path>
                          </svg>}
                          <p className="">{darkMode ? "Dark" : "Light"}</p>
                        </li>
                        <li className="border dark:border-white/20 my-1"></li>
                        <li onClick={() => handleLogout()} className="flex rounded-lg dark:text-white dark:hover:bg-gray-700 items-center px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer">
                          <FaSignOutAlt className="mr-3 dark:text-gray-400" />
                          Logout
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </>) : (<>
                <button
                  onClick={() => navigate("/login")}
                  className="bg-black dark:bg-white hover:ring-2 hover:ring-black
           dark:ring-offset-0 ring-offset-2 transition-all duration-300 md:w-auto w-[50%] justify-center flex items-center gap-2 dark:text-black text-white px-4 py-2 rounded-xl"
                >
                  <AiOutlineLogin className="mt-1" />
                  <span>Login</span>
                </button>
                <button
                  onClick={() => navigate("/sign-up")}
                  className="bg-black dark:bg-white hover:ring-2 hover:ring-black
           dark:ring-offset-0 ring-offset-2 transition-all duration-300 md:w-auto w-[50%] justify-center flex items-center gap-2 dark:text-black text-white px-4 py-2 rounded-xl"
                >
                  <FaUserPlus className="mt-1" />
                  <span>Sign Up</span>
                </button>
                <div onClick={() => dispatch(toggleTheme())} className="cursor-pointer">
                  {!darkMode && <svg
                    className="md:w-6 md:h-6 w-5 h-5 mr-2 -ml-[3px]"
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      className="stroke-gray-400"
                    ></path>
                    <path
                      d="M12 4v1M17.66 6.344l-.828.828M20.005 12.004h-1M17.66 17.664l-.828-.828M12 20.01V19M6.34 17.664l.835-.836M3.995 12.004h1.01M6 6l.835.836"
                      className="stroke-gray-400"
                    ></path>
                  </svg>}
                  {darkMode && <svg
                    className="md:w-6 md:h-6 w-5 h-5 mr-2 -ml-[3px]"
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
                      className="fill-black dark:fill-gray-400"
                    ></path>
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M17 3a1 1 0 0 1 1 1 2 2 0 0 0 2 2 1 1 0 1 1 0 2 2 2 0 0 0-2 2 1 1 0 1 1-2 0 2 2 0 0 0-2-2 1 1 0 1 1 0-2 2 2 0 0 0 2-2 1 1 0 0 1 1-1Z"
                      className="fill-black dark:fill-gray-400"
                    ></path>
                  </svg>}
                </div>
              </>)
            }
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
