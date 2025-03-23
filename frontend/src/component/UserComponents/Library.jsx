import React, { useEffect, useState } from 'react'
import defaultUser from "../../assets/default-user.jpg"
import { API } from '../../services/apiService';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from '../../redux/features/auth/authAction';
import { Link, NavLink, Outlet, useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import toast from 'react-hot-toast';



function Library() {
    const location = useLocation()
    console.log(location.pathname)
    const [selectedBtn, setSelectedBtn] = useState('liked-songs')
    const { user, error } = useSelector((state) => state.auth)
    const navigate = useNavigate()
    
    //getting the currently loggedin user
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getCurrentUser()); // Dispatch action directly
    }, [dispatch]);

    if (error) {
        toast.error("Please login...")
        navigate("/")
    }



    return (
        <div className="md:bg-white my-5 py-12 px-8 dark:md:bg-slate-900/50 dark:border-white/10 md:border md:rounded-3xl">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-5">
                    <img
                        src={defaultUser} // Replace with actual image URL
                        alt="Profile"
                        className="md:w-14 border border-gray-100 md:h-14 w-7 h-7 object-cover rounded-full"
                    />
                    <p className='text-2xl dark:text-gray-50 font-bold'>Your Library</p>
                </div>
            </div>
            <div className='flex items-center space-x-2 mt-5'>
                {/* Playlists Link */}
                <NavLink
                    to="/library/playlists"
                    className={({ isActive }) =>
                        `border dark:border-white/20 text-xs py-2 px-3 rounded-full ${isActive
                            ? "dark:bg-white bg-black text-white dark:text-black" // Active style
                            : "text-black dark:text-gray-50 hover:text-white hover:bg-black hover:dark:bg-white hover:dark:text-black" // Inactive style
                        }`
                    }
                >
                    Playlists
                </NavLink>

                {/* Liked Songs Link (Add end to avoid child route match) */}
                <NavLink
                    to="/library"
                    end // Ensures exact match with /library only
                    className={({ isActive }) =>
                        `border dark:border-white/20 text-xs py-2 px-3 rounded-full ${isActive
                            ? "dark:bg-white bg-black text-white dark:text-black" // Active style
                            : "text-black dark:text-gray-50 hover:text-white hover:bg-black hover:dark:bg-white hover:dark:text-black" // Inactive style
                        }`
                    }
                >
                    Liked Songs
                </NavLink>
            </div>
            <Outlet />
        </div>
    )
}

export default Library
