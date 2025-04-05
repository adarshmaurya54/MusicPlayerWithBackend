import React, { useState } from 'react'
import { LiaTimesSolid } from 'react-icons/lia'
import { useSelector } from 'react-redux'
import InputType from './auth/InputType'


function EditProfile({ setOpenEditProfile }) {
    const { user } = useSelector(state => state.auth)
    const [edit, setEdit] = useState(false)
    console.log(user);

    return (
        <div className="fixed flex justify-center items-center z-50 top-0 left-0 w-full h-full backdrop-blur-sm">
            <div className="relative overflow-hidden p-8 md:w-[400px] w-[320px] transition-all h-[90%] bg-white dark:bg-slate-700 rounded-3xl border-2 border-black/10">
                <div className={`absolute top-0 left-0 w-full transition-transform duration-500 ${!edit ? "translate-x-0" : "-translate-x-full"} flex h-full items-center justify-center`}>
                    <div className="flex gap-3 flex-col items-center justify-center w-full h-full">
                        <img
                            src={`${import.meta.env.VITE_BASEURL}/assets/users/${user.profilePic}`} // Replace with actual image URL
                            alt="Profile"
                            className="md:w-60 md:h-60 w-7 h-7 object-cover rounded-full"
                        />
                        <div className='flex items-center flex-col'>
                            <p className='text-black dark:text-white text-3xl font-bold'>{user.name}</p>
                            <p className='text-gray-500 dark:text-gray-300 text-sm'>{user.email}</p>
                        </div>
                        <button onClick={() => setEdit(true)} className='bg-gray-600 hover:bg-black text-white px-4 py-2 rounded-lg transition-all'>Edit Profile</button>
                    </div>
                </div>
                <div className={`absolute top-0 left-0 w-full transition-transform duration-500 ${!edit ? "translate-x-full" : "translate-x-0"} flex h-full items-center justify-center`}>
                    <div className="flex gap-3 flex-col items-center justify-center w-full h-full">
                        <InputType extraClass="mt-5" inputType="email" required={true} name="email"
                                    placeholder="E-mail"  />
                        <InputType extraClass="mt-5" inputType="email" required={true} name="email"
                                    placeholder="E-mail" />
                        <button onClick={() => setEdit(false)} className='bg-gray-600 hover:bg-black text-white px-4 py-2 rounded-lg transition-all'>Edit Profile</button>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => setOpenEditProfile(false)}
                    className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-500 transition-all"
                >
                    <LiaTimesSolid className="text-gray-700 dark:text-white" />
                </button>
            </div>
        </div>
    )
}

export default EditProfile
