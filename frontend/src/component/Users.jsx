import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../services/apiService";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const Users = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth)
    useEffect(() => {
        if (user?.role !== 'admin') {
            navigate("/")
            return;
        }
    }, [user])
    // Fetch users on component mount
    useEffect(() => {
        const fetchUsers = async () => {
            const toastId = toast.loading("Please wait...")
            try {
                const { data } = await API.get("auth/users");
                setUsers(data);
                toast.dismiss(toastId);
            } catch (error) {
                console.error("Error fetching users:", error);
                toast.error("Error fetching users", { id: toastId })
            }
        };
        if (user?.role === 'admin') {
            fetchUsers();
        }
    }, []);

    // Handle delete user
    const handleDelete = async (email) => {
        if (confirm("Do you want to delete this user?")) {
            const toastId = toast.loading("Please wait...")
            try {
                await API.delete(`auth/user/delete/${email}`);
                setUsers(prev => prev.filter(user => user.email !== email));
                toast.success("Deleted!", { id: toastId })
            } catch (error) {
                toast.error("Error deleting users", { id: toastId })
                console.error("Error deleting user:", error);
            }
        }
    };

    return (
        <div className="fixed bg-black/50 inset-0 z-50 flex justify-center items-center md:backdrop-blur-sm">
            <div className="bg-white bg-opacity-95 backdrop-blur-sm p-6 overflow shadow-2xl md:rounded-3xl md:w-[90%] md:h-[90%] h-full w-full ">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold">Users</h2>
                    <Link to="/">
                        <IoClose className="text-xl cursor-pointer hover:bg-gray-300 rounded-full" />
                    </Link>
                </div>

                {/* User Cards */}
                <div className="grid grid-cols-1 no-scrollbar overflow-auto h-[90%] sm:grid-cols-2 md:grid-cols-3 gap-6 rounded-2xl">
                    {users?.map((user, index) => (
                        <div key={index} className="bg-white relative rounded-2xl p-4 flex flex-col items-center text-center">
                            <img
                                src={`${import.meta.env.VITE_BASEURL}/assets/users/${user.profilePic}`}
                                alt={user.name}
                                className="w-24 h-24 rounded-full object-cover border mb-2"
                            />
                            <h3 className="text-lg font-semibold">{user.name}</h3>
                            <p className="text-gray-500">{user.email}</p>
                            <button
                                onClick={() => handleDelete(user.email)}
                                className="mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-full text-sm"
                            >
                                Delete
                            </button>
                            {user.role === 'admin' && <p className="absolute top-2 right-2 text-xs p-2 px-3 border rounded-xl">
                                Admin
                            </p>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Users;
