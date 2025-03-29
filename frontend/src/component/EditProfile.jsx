import React from 'react'
import { LiaTimesSolid } from 'react-icons/lia'
import defaultUser from "../assets/default-user.jpg"
import { useSelector } from 'react-redux'


function EditProfile({ setOpenEditProfile }) {
    const { user } = useSelector(state => state.auth)
    console.log(user);

    return (
        <div className="fixed flex justify-center items-center z-50 top-0 left-0 w-full h-full backdrop-blur-sm">
            <div className="relative p-8 md:w-[400px] w-[320px] transition-all h-[90%] bg-white rounded-3xl border-2 border-black/10">
                <div className="flex h-full items-center justify-center">
                    <div className="flex gap-3 flex-col items-center justify-center w-full h-full">
                        <img
                            src={defaultUser} // Replace with actual image URL
                            alt="Profile"
                            className="md:w-60 md:h-60 w-7 h-7 object-cover rounded-full"
                        />
                        <div className='flex items-center flex-col'>
                            <p className='text-black text-3xl font-bold'>{user.name}</p>
                            <p className='text-gray-500 text-sm'>{user.email}</p>
                        </div>
                        <button className='bg-gray-600 hover:bg-black text-white px-4 py-2 rounded-lg transition-all'>Edit Profile</button>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => setOpenEditProfile(false)}
                    className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                >
                    <LiaTimesSolid className="text-gray-700 dark:text-white" />
                </button>
            </div>
        </div>
    )
}

export default EditProfile
