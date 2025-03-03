import React, { useState } from "react";
import { Link } from "react-router-dom";
import InputType from "./InputType";
import bg from "../../assets/bg.jpg";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Login successful!");
      // Handle login logic here
    }
  };

  return (
    <div
      className="bg-center h-screen flex items-center justify-center bg-cover"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-700 shadow-lg rounded-3xl p-6"
      >
        <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">
          Login
        </h2>

        {/* Email Input */}
        <InputType
          labelText="Email"
          labelFor="email"
          inputType="email"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />

        {/* Password Input */}
        <InputType
          labelText="Password"
          labelFor="password"
          inputType="password"
          name="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        {/* Don't have an account? Section */}
        <div className="text-center mt-4">
          <p className="text-gray-700 dark:text-white">
            Don't have an account?{" "}
            <Link to="/sign-up" className="text-blue-500 hover:underline">
              Register
            </Link>
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-gray-700 mt-3 text-white font-bold py-2 px-4 rounded-[1rem] hover:bg-gray-900 "
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
