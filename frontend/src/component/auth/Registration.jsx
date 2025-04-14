import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputType from "./InputType";
import bg from "../../assets/bg.jpg";
import { API } from "../../services/apiService";
import toast from "react-hot-toast"; 
import { useSelector } from "react-redux";
import { IoPerson } from "react-icons/io5";
import { IoIosMail } from "react-icons/io";
import { IoLockClosedOutline } from "react-icons/io5";



function Registration() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (token && user) {
      toast.success("Already logged in!")
      navigate("/")
    }
  }, [token])

  const handleFileChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  const validateForm = () => {
    let errors = {};
    if (!name.trim()) errors.name = "Name is required";
    if (!email.trim()) {
      errors.email = "Email is required";
    }
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 2) {
      errors.password = "Password must be at least 6 characters";
    }
    if (!confirmPassword) {
      errors.confirmPassword = "Confirm Password is required";
    } else if (confirmPassword !== password) {
      errors.confirmPassword = "Passwords do not match";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (validateForm()) {
      const toastId = toast.loading("Please wait...");
  
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("profilePic", profilePic); // file input
  
      try {
        await API.post("/auth/signup", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
  
        toast.success("Registration Successful!", { id: toastId });
        navigate("/login");
      } catch (error) {
        toast.error(error.response?.data?.error || "Something went wrong", {
          id: toastId,
        });
      }
    }
  };

  return (
    <div className="bg-center font-poppins h-screen md:px-0 px-6 flex items-center justify-center bg-cover"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form onSubmit={handleSubmit} className=" max-w-[685px] bg-gradient-to-t from-white to-blue-50 border-4 border-white shadow-lg rounded-3xl p-6">
        <h2 className="text-2xl font-extrabold mb-6 text-center dark:text-white">Sign Up</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputType icon={<IoPerson />} labelText="Full Name" labelFor="name" inputType="text" name="name"
            placeholder="Enter your name" value={name}
            onChange={(e) => setName(e)} error={errors.name} />
          <InputType icon={<IoIosMail />} labelText="Email" labelFor="email" inputType="email" name="email"
            placeholder="Enter your email" value={email}
            onChange={(e) => setEmail(e)} error={errors.email} />
          <InputType icon={<IoLockClosedOutline />} labelText="Password" labelFor="password" inputType="password" name="password"
            placeholder="Enter your password" value={password}
            onChange={(e) => setPassword(e)} error={errors.password} />
          <InputType icon={<IoLockClosedOutline />} labelText="Confirm Password" labelFor="confirmPassword" inputType="password"
            name="confirmPassword" placeholder="Re-enter your password"
            value={confirmPassword} onChange={(e) => setConfirmPassword(e)}
            error={errors.confirmPassword} />

          {/* Profile Picture Upload */}
          <div className="flex flex-col">
            <label className="text-gray-700 md:text-base text-xs font-bold dark:text-white mb-1" htmlFor="profilePic">
              Profile Picture (Optional)
            </label>
            <input type="file" accept="image/*" id="profilePic"
              onChange={handleFileChange} className="shadow-lg bg-white file:bg-slate-100 file:text-sm file:p-1 file:px-2 file:rounded-lg file:border-none rounded-xl p-2" />
          </div>
        </div>

        {/* Already have an account? Section */}
        <div className="text-center mt-4">
          <span className="block mt-3 mb-1 ml-3 text-xs text-gray-400">
            <p>Already have an account? <Link className="text-blue-500 hover:underline" to='/login'>Log in</Link></p>
          </span>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button type="submit"
            className="bg-gray-700 mt-3 text-white font-bold py-2 px-4 rounded-[1rem] hover:bg-gray-900">
            Register
          </button>
        </div>
      </form>
    </div>
  );
}

export default Registration;
