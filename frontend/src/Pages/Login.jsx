import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import image from "../../public/newFoodSignup.jpeg"

import useGoogleAuth from "../../common/useGoogleAuth"



const Login = () => {
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [show, setShow] = useState(false); //Eye EyeSlash Toggle
  const [form, setForm] = useState({
    searchTerm: "",
    password: "",
  });
  const [loading, setLoading] = useState(false)
  // Handling Login Form
  const handleChange = async (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      return { ...prev, [name]: value };
    });
  };

  // Handle Login Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true)
    axios
      .post(`${backendURL}/api/login`, form)
      .then((res) => {
        if (res.data.success) {
          setLoading(true)
          toast.success("Login Successful");
          localStorage.setItem("tastytoken", JSON.stringify(res.data.token));
          // creating a token named "username" for storing logged in user's name for comment purposes
          localStorage.setItem(
            "username",
            JSON.stringify(res.data.user.username)
          );
          localStorage.setItem("userData", JSON.stringify(res.data.user));

          navigate(`/user/${res.data.user._id}`, {
            state: { user: res.data.user },
          });
        }
      })
      .catch((err) => {
        setLoading(false)
        toast.error(err.response.data.message);
      });
  };

  // Reusable function
  const handleLogin = (formData) => {
    setLoading(true)
    axios
      .post(`${backendURL}/api/login`, formData)
      .then((res) => {
        if (res.data.success) {
          setLoading(false)
          toast.success("Login Successful");
          localStorage.setItem("tastytoken", JSON.stringify(res.data.token));
          navigate(`/user/${res.data.user._id}`, {
            state: { user: res.data.user },
          });
        }
      })
      .catch((err) => {
        setLoading(false)
        toast.error(err.response.data.message);
      });
  };
  // Using custom Google Auth hook
  const googleLogin = useGoogleAuth(handleLogin);

  return (

    <>
    <div className="w-full  min-h-screen flex justify-center items-center md:flex-row px-4">
    <div className="content w-full max-w-screen-xl h-full sm:h-auto  flex flex-col md:flex-row justify-evenly items-center flex-wrap">
      {/* Left Section */}
      <div className="illustrations w-full md:w-1/2 lg:w-2/5 h-auto   flex flex-col items-center md:items-start p-4">
        <h1 className="font-extrabold text-2xl sm:text-3xl md:text-4xl text-center md:text-left leading-tight">
          Explore Dishes Across the globe like <span className="text-red-400">never before...</span>
        </h1>
  
        <div className="content flex flex-col md:flex-row items-center md:items-start mt-5 gap-6">
          <div className="img w-full md:w-1/2  lg:w-[20vw] h-auto  ">
            <img className="h-full w-full rounded-3xl object-cover" src={image} alt="Dish illustration" />

          </div>
          <div className="innerContent mt-4 md:mt-8 ">
            <ul className="font-bold text-xl sm:text-2xl md:text-2xl ml-0 md:ml-6 px-5">
              <li className="text-yellow-500 py-1">Review</li>
              <li className="text-red-500 py-1">Share</li>
              <li className="py-1">Comments</li>
            </ul>
          </div>
        </div>
      </div>
  
      {/* Right Section (Login Form) */}
      <div className="loginForm w-full md:w-[40%]  lg:w-[30%] h-auto flex justify-center  items-center mt-8 md:mt-0 p-4">
        <div className="innerdiv w-full max-w-md border-t-2 rounded-xl shadow-xl py-5 px-6 bg-white ">
          <h2 className="font-semibold text-lg sm:text-xl md:text-2xl text-center">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="form-group">
              <label htmlFor="email" className="font-semibold text-sm">Email</label>
              <input
                type="text"
                name="searchTerm"
                id="searchTerm"
                placeholder="name@company.com"
                required={true}
                value={form.searchTerm}
                onChange={handleChange}
                className="w-full h-[6vh] pl-3 rounded-md bg-white border-2 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 sm-h-[8vh]"
              />
            </div>
  
            <div className="form-group">
              <label htmlFor="password" className="font-semibold text-sm">Password</label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="w-full h-[6vh] sm-h-[8vh] pl-3 rounded-md bg-white border-2 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required={true}
                  value={form.password}
                  onChange={handleChange}
                />
                <FontAwesomeIcon
                  icon={show ? faEye : faEyeSlash}
                  onClick={() => setShow(!show)}
                  className="absolute top-0 right-0 m-3 cursor-pointer"
                />
                <p className="text-[12px] mt-2 cursor-pointer text-blue-500">Forgot Password?</p>
              </div>
            </div>
  
            <button
              type="submit"
              className="w-full p-3 bg-red-700 text-white rounded-md hover:bg-red-600 transition hover:border-white hover:border-solid hover:border-2"
            >
              Sign in
            </button>
  
            <p className="text-center">or continue with</p>
  
            <button
              type="button"
              onClick={() => googleLogin()}
              className="w-full p-3 bg-red-700 hover:bg-red-500 text-white rounded-md transition hover:border-white hover:border-solid hover:border-2"
            >
              Sign in with Google
            </button>
  
            <p className="text-[12px] text-center">
              New to TastyTrails?{" "}
              <Link
                to="/signup"
                className="font-medium text-blue-500 hover:underline dark:text-primary-500 hover:text-red-700"
              >
                Register for free
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
  </>
  );
};

export default Login;