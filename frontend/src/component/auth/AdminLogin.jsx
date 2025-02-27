import React, { useEffect, useState } from "react";
import apiService from "../../services/apiService";
import { useNavigate } from "react-router-dom";
import MessageCard from "../MessageCard";
import bg from "../../assets/bg.jpg";


function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Error message state
  const [loginLoading, setLoginLoading] = useState(false);

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
    setLoginLoading(true);
    try {
      // Call the backend API for login
      const response = await apiService.login({ email, password });

      // Store the JWT token in localStorage
      localStorage.setItem("token", response.token);
      setLoginLoading(false)
      navigate("/"); // Redirect to the dashboard or another page
    } catch (error) {
      setLoginLoading(false)
      setError("Please check your credentials and try again.");
    }
  };

  return (
    <div
      className="h-screen relative flex overflow-x-hidden items-center justify-center bg-center bg-cover"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="max-w-xs bg-gradient-to-t from-white to-blue-50 rounded-3xl p-6 border-4 border-white shadow-lg mx-auto my-5">
        <div className="text-center font-extrabold text-2xl text-black">
          Admin Login
        </div>
        {error && (
          <MessageCard
            type="error"
            message="Login failed"
            subMessage={error}
            setError={setError}
            crossbtn={true}
          />
        )}
        {loginLoading && (
          <MessageCard
            type="info"
            message="Please wait for a moment..."
            subMessage="We are processing your login."
            setError={setError}
            crossbtn={false}
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
          <span className="block mt-3 ml-3 text-xs text-gray-400">
            <a href="#">Forgot Password ?</a>
          </span>
          <input
            className="block w-full font-bold bg-black text-white py-3 mt-5 rounded-2xl shadow-lg transform transition-transform hover:scale-105 active:scale-95"
            type="submit"
            value="Sign In"
          />
        </form>
        <button
          className="bg-white border mt-5 text-center  w-full rounded-2xl h-14 relative text-black text-xl font-semibold group"
          type="button"
          onClick={() => navigate('/')}
        >
          <div className="bg-black text-white rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[calc(100%-8px)] z-10 duration-500">
          
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1024 1024"
              height="25px"
              width="25px"
            >
              <path
                d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
                fill="#fff"
              ></path>
              <path
                d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
                fill="#fff"
              ></path>
            </svg>
          </div>
          <p className="translate-x-2">Go Back</p>
        </button>
      </div>
    </div>
  );
}

export default AdminLogin;
