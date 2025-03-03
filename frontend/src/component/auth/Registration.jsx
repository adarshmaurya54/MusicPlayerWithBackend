import React, { useState } from "react";
import { Link } from "react-router-dom";
import InputType from "./InputType";
import bg from "../../assets/bg.jpg";
import { API } from "../../services/apiService";
import toast, { Toaster } from "react-hot-toast";  // 🔥 Import Hot Toast

function Registration() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [errors, setErrors] = useState({});

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
      const toastId = toast.loading("Registering..."); 
      
      try {
        await API.post("/signup", { name, email, password, profilePic });

        toast.success("Registration Successful!", { id: toastId }); 
      } catch (error) {
        toast.error(error.response.data.error, { id: toastId });
      }
    }
  };

  return (
    <div className="bg-center h-screen flex items-center justify-center bg-cover"
         style={{ backgroundImage: `url(${bg})` }}
    >
      
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-700 shadow-lg rounded-3xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">Sign Up</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputType labelText="Full Name" labelFor="name" inputType="text" name="name"
                     placeholder="Enter your name" value={name}
                     onChange={(e) => setName(e.target.value)} error={errors.name} />
          <InputType labelText="Email" labelFor="email" inputType="email" name="email"
                     placeholder="Enter your email" value={email}
                     onChange={(e) => setEmail(e.target.value)} error={errors.email} />
          <InputType labelText="Password" labelFor="password" inputType="password" name="password"
                     placeholder="Enter your password" value={password}
                     onChange={(e) => setPassword(e.target.value)} error={errors.password} />
          <InputType labelText="Confirm Password" labelFor="confirmPassword" inputType="password"
                     name="confirmPassword" placeholder="Re-enter your password"
                     value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                     error={errors.confirmPassword} />

          {/* Profile Picture Upload */}
          <div className="flex flex-col">
            <label className="text-gray-700 dark:text-white mb-1" htmlFor="profilePic">
              Profile Picture (Optional)
            </label>
            <input type="file" accept="image/*" id="profilePic"
                   onChange={handleFileChange} className="border border-gray-300 dark:border-gray-600 rounded-lg p-2"/>
          </div>
        </div>

        {/* Already have an account? Section */}
        <div className="text-center mt-4">
          <p className="text-gray-700 dark:text-white">
            Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Log in</Link>
          </p>
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
