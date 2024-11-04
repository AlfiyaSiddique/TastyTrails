import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import validate from "../../common/validation.js";
import axios from "axios";
import { toast } from "react-toastify";

import useGoogleAuth from "../../common/useGoogleAuth"
import image from "../../public/registerimage.jpg"

const Signup = () => {

  const navigator = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    // Signup Form Data
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const [error, setError] = useState({
    // Inline validation Statements
    firstName: false,
    firstNameError: false,
    lastName: false,
    lastNameError: false,
    username: false,
    usernameError: false,
    email: false,
    emailError: false,
    password: false,
    passwordError: false,
    cpassword: false,
    cpasswordError: false,
  });

  const handleChange = async (e) => {
    // Handling Signup Form
    const { name, value } = e.target;
    let message = {};

    // Trim trailing spaces for username
    const trimmedValue = name === "username" ? value.trim() : value;

    if (name === "cpassword") {
      message = validate.cpasssword(trimmedValue, form.password);
    } else if (name === "username") {
      message = await validate.username(trimmedValue);
    } else {
      message = validate[name](trimmedValue);
    }

    setError((prev) => {
      return { ...prev, ...message };
    });

    setForm((prev) => {
      return { ...prev, [name]: trimmedValue };
    });
  };

  // Get all the current username present
  const getUsernames = async () => {
    return await axios
      .get(`${backendURL}/api/usernames`)
      .then((data) => data.data.usernames)
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmit = async (e) => {
    // Handle Signup Submit
    e.preventDefault();
    setLoading(true)
    let submitable = true;

    Object.values(error).forEach((val) => {
      if (val) {
        submitable = false;
        return;
      }
    });

    if (submitable) {
      const usernames = await getUsernames();
      if (usernames.includes(form.username)) {
        setLoading(false)
        toast.error("Username already exist please try another.");
      } else {
        axios
          .post(`${backendURL}/api/signup`, form)
          .then((res) => {
            if (res.data.success) {
              setLoading(false)
              toast.success("User Created Successfully");
              localStorage.setItem(
                "tastytoken",
                JSON.stringify(res.data.token)
              );
              // creating a token named "username" for storing logged in user's name for comment purposes
              localStorage.setItem(
                "username",
                JSON.stringify(res.data.user.username)
              );
              navigator(`/user/${res.data.user._id}`, {
                state: { user: res.data.user },
              });
            }
          })
          .catch((err) => {
            setLoading(false)
            toast.error(err.response.data.message);
          });
      }
    } else {
      setLoading(false)
      toast.error("Fill all fields with valid values");
    }
  };

  const handleGoogleSignup = async (googleUser) => {
    setLoading(true)
    const googleForm = {
      // Defining Google-specific form data here
      firstName: googleUser.firstName,
      lastName: googleUser.lastName,
      email: googleUser.email,
      profile: googleUser.profile,
      username: googleUser.username,
      password: googleUser.password,
    };
    try {
      const res = await axios.post(`${backendURL}/api/signup`, googleForm);
      if (res.data.success) {
        setLoading(false)
        toast.success("Google Signup Successful");
        localStorage.setItem("tastytoken", JSON.stringify(res.data.token));
        // creating a token named "username" for storing logged in user's name for comment purposes
        localStorage.setItem(
          "username",
          JSON.stringify(res.data.user.username)
        );
        navigator(`/user/${res.data.user._id}`, {
          state: { user: res.data.user },
        });
      }
    } catch (err) {
      setLoading(false)
      toast.error(err.response.data.message || "Google signup failed");
    }
  };



  return (
   <div className="Container min-h-screen  bg-white flex justify-center items-center  px-4 sm:px-8 md:px-12 lg:px-16">
    <div className="InnerDiv  w-full max-w-[95vw] lg:max-w-[85vw]  xl:max-w-[75vw] md:w-[75vw] mb-8 flex flex-col md:flex-row justify-between items-center lg:flex-row  space-y-12 lg:space-y-0">
      {/* Left Section */}
      <div className="left w-full md:w-[45%] lg:w-[40%] text-center lg:text-left space-y-8">
        <div className="content w-full">
          <h2 className="font-extrabold text-3xl sm:text-4xl md:text-4xl text-center md:text-left">
            Join the Community of Over{" "}
            <span className="text-red-500">1 million+ people</span>
          </h2>
          <div className="image  ml-6  mt-6">
            <img

              className="w-full max-w-[28rem] rounded-full md:h-[65vh]  shadow-md "

              src={image}
              alt="Community"
            />
          </div>
          <h3 className="font-extrabold text-2xl sm:text-3xl md:text-3xl mt-8 text-center lg:text-4xl">
            <span className="">#1</span> Food Review{" "}
            <span className="text-red-500">Explore</span> Site
          </h3>
        </div>
      </div>
  
      {/* Right Section (Form) */}
      <div className="right w-full md:w-[50%] lg:w-[50%] flex justify-center">
        <div className="form w-full max-w-[90%]  md:w-[80%] lg:max-w-[80%] h-auto p-6  shadow-md rounded-xl ">
          <h1 className="text-black text-xl lg:text-2xl text-center mb-6">Register</h1>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* First and Last Name */}
            <div className="name flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
              <div className="first w-full md:w-[48%] ">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-black"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="w-full p-3 rounded-lg bg-white border border-gray-300 text-gray-900 focus:ring-primary-600 focus:border-primary-600"
                  placeholder="Ex. John"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />
                {error.firstName && (
                  <p className="text-red-500 text-sm">{error.firstNameError}</p>
                )}
              </div>
  
              <div className="second w-full md:w-[48%]">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-black"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="w-full p-3 rounded-lg bg-white border border-gray-300 text-gray-900 focus:ring-primary-600 focus:border-primary-600"
                  placeholder="Ex. Doe"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />
                {error.lastName && (
                  <p className="text-red-500 text-sm">{error.lastNameError}</p>
                )}
              </div>
            </div>
  
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-black"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="w-full p-3 rounded-lg bg-white border border-gray-300 text-gray-900 focus:ring-primary-600 focus:border-primary-600"
                placeholder="Ex. jhonedoe12"
                value={form.username}
                onChange={handleChange}
                required
              />
              {error.username && (
                <p className="text-red-500 text-sm">{error.usernameError}</p>
              )}
            </div>
  
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-black"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full p-3 rounded-lg bg-white border border-gray-300 text-gray-900 focus:ring-primary-600 focus:border-primary-600"
                placeholder="abc@gmail.com"
                value={form.email}
                onChange={handleChange}
                required
              />
              {error.email && (
                <p className="text-red-500 text-sm">{error.emailError}</p>
              )}
            </div>
  
            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-black"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="w-full p-3 rounded-lg bg-white border border-gray-300 text-gray-900 focus:ring-primary-600 focus:border-primary-600"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <FontAwesomeIcon
                  icon={show ? faEye : faEyeSlash}
                  onClick={() => setShow(!show)}
                  className="absolute top-0 right-3 m-3 cursor-pointer"
                />
              </div>
              {error.password && (
                <div className="text-red-500 text-sm mt-2">
                  <ul className="list-disc pl-5">
                    <li>Minimum 8 characters</li>
                    <li>At least 1 uppercase letter</li>
                    <li>At least 1 lowercase letter</li>
                    <li>At least 1 number</li>
                    <li>At least 1 symbol</li>
                  </ul>
                </div>
              )}
            </div>
  
            {/* Confirm Password */}
            <div>
              <label
                htmlFor="cpassword"
                className="block text-sm font-medium text-black"
              >
                Confirm Password
              </label>
              <input
                type="password"
                name="cpassword"
                id="cpassword"
                placeholder="••••••••"
                className="w-full p-3 rounded-lg bg-white border border-gray-300 text-gray-900 focus:ring-primary-600 focus:border-primary-600"
                value={form.cpassword}
                onChange={handleChange}
                required
              />
              {error.cpassword && (
                <p className="text-red-500 text-sm mt-0 mb-2">
                  {error.cpasswordError}
                </p>
              )}
            </div>
  
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full   md:ml-16 md:w-[18vw] h-[5vh] mx-auto mt-6 bg-red-700 text-white rounded-md hover:bg-red-600 transition hover:border-white hover:border-solid hover:border-2"
            >
              Sign up
            </button>
  
            {/* Login Link */}
            <p className="text-black text-center mt-4 text-[18px]">
              Already have an account?{" "}
              <Link
                to="/Login"
                className="text-blue-400 hover:text-blue-500 pl-2"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
  );
};

 
export default Signup
