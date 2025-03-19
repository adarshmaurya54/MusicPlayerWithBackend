import React, { useEffect, useState } from 'react'
import defaultUser from "../../assets/default-user.jpg"
import { API } from '../../services/apiService';
import { useDispatch } from 'react-redux';
import { getCurrentUser } from '../../redux/features/auth/authAction';
import { Link, Outlet } from 'react-router-dom';



function Library() {
    const [selectedBtn, setSelectedBtn] = useState('liked-songs')
    //getting the currently loggedin user
    const dispatch = useDispatch();
    const getUser = async () => {
        try {
            const { data } = await API.get("/auth/current-user");
            if (data?.success) {
                dispatch(getCurrentUser(data));
            }
        } catch (error) {
            localStorage.clear();
            console.log(error);
        }
    };

    useEffect(() => {
        getUser();
    }, []);
    

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
                <Link
                    to="/library/playlists"
                    className={`${selectedBtn !== "playlists"
                        ? "text-black dark:text-gray-50 hover:text-white hover:bg-black hover:dark:bg-white hover:dark:text-black"
                        : "dark:bg-white bg-black text-white dark:text-black"
                        } border dark:border-white/20 text-xs py-2 px-3 rounded-full`}
                    onClick={() => setSelectedBtn("playlists")}
                >
                    Playlists
                </Link>
                <Link
                    to='/library'
                    onClick={() => setSelectedBtn("liked-songs")}
                    className={`${selectedBtn !== "liked-songs"
                        ? "text-black dark:text-gray-50 hover:text-white hover:bg-black hover:dark:bg-white hover:dark:text-black"
                        : "dark:bg-white bg-black text-white dark:text-black"
                        } border dark:border-white/20 text-xs py-2 px-3 rounded-full`}
                >
                    Liked Songs
                </Link>
            </div>
            <Outlet />
        </div>
    )
}

export default Library
