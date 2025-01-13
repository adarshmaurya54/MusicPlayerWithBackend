import React, { useEffect, useState } from "react";
import apiService from "../services/apiService";
import { useNavigate } from "react-router-dom";
import MessageCard from "./MessageCard";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Error message state

  const navigate = useNavigate(); // To navigate to another page on success

  // Check for existing JWT token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/"); // Redirect to dashboard if token is found
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Call the backend API for login
      const response = await apiService.login({ email, password });

      // Store the JWT token in localStorage
      localStorage.setItem("token", response.token);

      navigate("/"); // Redirect to the dashboard or another page
    } catch (error) {
      setError("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <div
      className="h-screen relative flex overflow-x-hidden items-center justify-center bg-center bg-cover"
      style={{ backgroundImage: `url(/bg.jpg)` }}
    >
      <div className="max-w-xs bg-gradient-to-t from-white to-blue-50 rounded-3xl p-6 border-4 border-white shadow-lg mx-auto my-5">
        <div className="text-center font-extrabold text-2xl text-blue-500">
          Sign In
        </div>
        {error && (
          <MessageCard
            type="error"
            message="Error message"
            subMessage={error}
            setError={setError}
          />
        )}
        <form className="mt-5" onSubmit={handleLogin}>
          <input
            required
            className="w-full bg-white border-none px-5 py-3 rounded-2xl mt-4 shadow-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="email"
            name="email"
            id="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            required
            className="w-full bg-white border-none px-5 py-3 rounded-2xl mt-4 shadow-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="block mt-3 ml-3 text-xs text-blue-400">
            <a href="#">Forgot Password ?</a>
          </span>
          <input
            className="block w-full font-bold bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 mt-5 rounded-2xl shadow-lg transform transition-transform hover:scale-105 active:scale-95"
            type="submit"
            value="Sign In"
          />
        </form>
        <div className="mt-6">
          <span className="block text-center text-xs text-gray-400">
            Or Sign in with
          </span>
          <div className="flex justify-center gap-4 mt-2">
            {/* Social Login Buttons */}
            <button className="bg-gradient-to-r from-black to-gray-700 border-4 border-white p-2 rounded-full w-10 h-10 flex justify-center items-center shadow-lg transform transition-transform hover:scale-125 active:scale-90">
              <svg
                className="fill-white"
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 488 512"
              >
                <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
              </svg>
            </button>
            {/* Add other social login buttons here */}
          </div>
        </div>
        <span className="block text-center mt-4 text-blue-400 text-xs">
          <a href="#">Learn user licence agreement</a>
        </span>
      </div>
    </div>
  );
}

export default Login;
