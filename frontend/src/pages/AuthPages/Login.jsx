import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bg from "../../assets/bg.jpg";
import InputType from "../../component/auth/InputType";
import { getCurrentUser, userLogin } from "../../redux/features/auth/authAction"
import store from "../../redux/store"
import { useDispatch, useSelector } from "react-redux";
import { IoIosMail } from "react-icons/io";
import { IoLockClosedOutline } from "react-icons/io5";
import { GoArrowLeft } from "react-icons/go";



function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState("user")

  const navigate = useNavigate(); // To navigate to another page on success
  const { user, token } = useSelector((state) => state.auth)
  const dispatch = useDispatch();
    useEffect(() => {
      dispatch(getCurrentUser()); // Dispatch action directly
    }, [dispatch]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      store.dispatch(userLogin({ email, password, loginType }))
    } catch (error) {
      console.log(error);
    }
  };

  // Redirect to home page after successful login
  useEffect(() => {
    if (token && user) {
      navigate("/"); 
    }
  }, [token,user, navigate]);

  const toggleLoginType = () => {
    setLoginType((prevType) => (prevType === "admin" ? "user" : "admin"));
  };

  return (
    <div
      className="h-screen font-poppins relative flex overflow-x-hidden items-center justify-center bg-center bg-cover"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="w-[330px] bg-gradient-to-t from-white to-blue-50 rounded-3xl p-6 border-4 border-white shadow-lg mx-auto my-5">
        <div className="text-center font-extrabold text-2xl text-black">
          Login
        </div>
        <div className="rounded-2xl p-3 bg-white mt-3">
          <div className="relative w-full flex items-center ">
            <div className={`absolute z-10 top-0 ${loginType === "user" ? "left-[50%]" : "left-[0%]"}  transition-all duration-500 bg-black rounded-xl h-full w-1/2`}></div>
            <div onClick={() => toggleLoginType()} className={`w-1/2 z-20 text-center cursor-pointer transition-colors duration-500 rounded-xl p-2 ${loginType === "admin" ? "text-white" : "text-black"}`}>
              Admin
            </div>
            <div onClick={() => toggleLoginType()} className={`w-1/2 z-20 text-center cursor-pointer transition-colors duration-500 rounded-xl p-2 ${loginType === "user" ? "text-white" : "text-black"}`}>
              User
            </div>
          </div>
        </div>
        <form onSubmit={handleLogin}>

          <InputType icon={<IoIosMail/>} extraClass="mt-5" inputType="email" required={true} name="email"
            placeholder="E-mail" value={email}
            onChange={(e) => setEmail(e)} />
          <InputType icon={<IoLockClosedOutline/>} extraClass='mt-5' inputType="password" name="password"
            placeholder="Password" value={password}
            onChange={(e) => setPassword(e)} />
          <span className="block mt-3 mb-1 ml-3 text-xs text-gray-400">
            <p>Don't have an account? <Link className="text-blue-500 hover:underline" to='/sign-up'>Sign Up</Link></p>
          </span>
          <span className="block ml-3 text-xs text-gray-400">
            <a href="#">Forgot Password ?</a>
          </span>
          <input
            className="block w-full font-bold bg-black text-white py-3 mt-5 rounded-2xl shadow-lg transform transition-transform hover:scale-105 active:scale-95"
            type="submit"
            value="Sign In"
          />
        </form>
        <button
          className="bg-white group border-2 border-[#8251c5] mt-5 text-center  w-full rounded-2xl h-14 relative text-black text-xl font-semibold group"
          type="button"
          onClick={() => navigate('/')}
        >
          <div className="bg-gradient-to-r group from-[#8251c5] to-[#5c3ab5] text-white rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-[2px] top-[2px] group-hover:w-[calc(100%-4px)] z-10 duration-500">
          <GoArrowLeft className="group-hover:opacity-0 opacity-100 transition-all duration-300" />
          </div>
          <span className="relative z-20 ml-10 group-hover:ml-0 transition-all duration-500 text-black group-hover:text-white">Go Back</span>
        </button>
      </div>
    </div>
  );
}

export default Login;
