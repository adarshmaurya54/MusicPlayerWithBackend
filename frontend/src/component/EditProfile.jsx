import React, { useEffect, useRef, useState } from 'react'
import { LiaTimesSolid } from 'react-icons/lia'
import { useDispatch, useSelector } from 'react-redux'
import InputType from './auth/InputType'
import toast from 'react-hot-toast'
import { API } from '../services/apiService'
import { setUser } from "../redux/features/auth/authSlice"
import { FaRegUser } from 'react-icons/fa'


function EditProfile({ setOpenEditProfile }) {
    const { user } = useSelector(state => state.auth)
    const [currentUser, setCurrentUser] = useState(null)
    const [edit, setEdit] = useState(false)
    const [profilePic, setProfilePic] = useState(null)
    const [name, setName] = useState('')
    const fileInputRef = useRef(null);
    const [userId, setUserId] = useState('')
    const handleFileChange = (e) => {
        setProfilePic(e.target.files[0]);
    };
    const dispatch = useDispatch();

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setUserId(user._id || '');
            setCurrentUser(user);
        }
    }, [user]);
    const handleUpdate = async (e) => {
        e.preventDefault();

        const toastId = toast.loading("Updating profile...");

        try {
            if (profilePic) {
                const formData = new FormData();
                formData.append("name", name);
                formData.append("profilePic", profilePic);
                formData.append("oldProfilePic", currentUser?.profilePic)
                const { data } = await API.delete(`auth/user/profile/delete/${currentUser?.profilePic}`)
                if (data.success) {
                    const resp = await API.put("auth/user/update", formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    });
                    dispatch(setUser(resp.data.user));
                }
            } else {
                const resp = await API.put("auth/user/update", { name });
                setCurrentUser(resp.data.user)
                dispatch(setUser(resp.data.user));
            }

            toast.success("Profile updated successfully!", { id: toastId });
            setEdit(false);
        } catch (error) {
            toast.error(error.response?.data?.error || "Update failed", {
                id: toastId,
            });
        }
    };

    const handleBack = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setProfilePic(null);
        setEdit(false);
    }

    return (
        <div className="fixed flex justify-center items-center z-50 top-0 left-0 w-full h-full backdrop-blur-sm">
            <div className="relative overflow-hidden p-8 md:w-[400px] w-[320px] transition-all md:h-[90%] h-[500px] bg-white dark:bg-slate-700 rounded-3xl border-2 dark:border-white/10 bg-gradient-to-t from-white to-blue-50">
                <div className={`absolute top-0 left-0 w-full transition-transform duration-500 ${!edit ? "translate-x-0" : "-translate-x-full"} flex h-full items-center justify-center`}>
                    <div className="flex gap-3 flex-col items-center justify-center w-full h-full">
                        <img
                            src={`${import.meta.env.VITE_BASEURL}/assets/users/${currentUser?.profilePic}`} // Replace with actual image URL
                            alt="Profile"
                            className="md:w-60 md:h-60 w-36 h-36 object-contain border rounded-full"
                        />
                        <div className='flex items-center flex-col'>
                            <p className='text-black dark:text-white text-3xl font-bold'>{currentUser?.name}</p>
                            <p className='text-gray-500 dark:text-gray-300 text-sm'>{currentUser?.email}</p>
                        </div>
                        <button onClick={() => setEdit(true)} className='bg-gray-600 hover:bg-black text-white px-4 py-2 rounded-lg transition-all'>Edit Profile</button>
                    </div>
                </div>
                <div className={`absolute top-0 left-0 w-full transition-transform duration-500 ${!edit ? "translate-x-full" : "translate-x-0"} flex h-full items-center justify-center`}>
                    <form onSubmit={handleUpdate} className="flex p-5 text-black gap-3 flex-col items-center justify-center w-full h-full">
                        <h1 className='font-bold text-3xl'>Edit Profile</h1>
                        <InputType icon={<FaRegUser />} extraClass="mt-5" labelText="Name" inputType="text" required={true} name="name"
                            placeholder="Name" onChange={(e) => setName(e)} value={name} />
                        <div className='w-full'>
                            <label
                                className="block text-gray-700 dark:text-gray-300 text-xs font-bold mb-2"
                            >
                                Profile Pic
                            </label>
                            <input ref={fileInputRef} type="file" accept="image/*" id="profilePic"
                                onChange={handleFileChange} className="shadow-lg w-full bg-white file:bg-slate-100 file:text-sm file:p-1 file:px-2 file:rounded-lg file:border-none rounded-xl p-2" />
                        </div>
                        <div className='w-full flex items-center justify-between mt-5'>
                            <button type='button' onClick={() => handleBack()} className='border border-black text-black hover:bg-black text-sm hover:text-white px-3 py-2 rounded-lg transition-all'>Back</button>
                            <button type='submit' className='bg-gray-600 hover:bg-black text-sm text-white px-3 py-2 rounded-lg transition-all'>Update Profile</button>
                        </div>
                    </form>
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
