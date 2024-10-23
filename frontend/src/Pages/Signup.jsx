
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import validate from "../../common/validation.js";
import axios from "axios";
import { toast } from "react-toastify";
import useGoogleAuth from "../../common/useGoogleAuth"
import image from "../../public/newFoodSignup.jpeg"

const Signup = () => {
  const navigator = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [passwordFocused,setPasswordFocused]=useState(false);
  const [show, setShow] = useState(false); 
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
        toast.error("Username already exist please try another.");
      } else {
        axios
          .post(`${backendURL}/api/signup`, form)
          .then((res) => {
            if (res.data.success) {
              toast.success("User Created Successfully");
              localStorage.setItem(
                "tastytoken",
                JSON.stringify(res.data.token)
              );
              // creating a token named "username" for storing logged in user's name for comment purposes
              localStorage.setItem("username", JSON.stringify(res.data.user.username));
              navigator(`/user/${res.data.user._id}`, {
                state: { user: res.data.user },
              });
            }
          })
          .catch((err) => {
            toast.error(err.response.data.message);
          });
      }
    } else {
      toast.error("Fill all fields with valid values");
    }
  };

  const handleGoogleSignup = async (googleUser) => {
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
      toast.success("Google Signup Successful");
      localStorage.setItem("tastytoken", JSON.stringify(res.data.token));
      // creating a token named "username" for storing logged in user's name for comment purposes
      localStorage.setItem("username", JSON.stringify(res.data.user.username));
      navigator(`/user/${res.data.user._id}`, {
        state: { user: res.data.user },
      });
    }
  } catch (err) {
    toast.error(err.response.data.message || "Google signup failed");
  }
};

const googleSignup = useGoogleAuth(handleGoogleSignup, true);

  return (
 <div className="w-full h-screen flex justify-center items-center px-4">
    <div className="content w-full sm:w-[90vw] md:w-[75vw] lg:w-[70vw] xl:w-[65vw] h-full sm:h-[80vh] md:h-[70vh] lg:h-[60vh] xl:h-[55vh] rounded-md flex flex-col md:flex-row justify-evenly items-center">
      {/* Left Section */}
      <div className="illustrations w-full md:w-[50%] lg:w-[40%] h-[40vh] sm:h-[50vh] lg:h-[45vh] flex flex-col items-center md:items-start">
        <h1 className="font-extrabold text-2xl sm:text-3xl md:text-4xl text-center md:text-left">
          Explore Dishes Across the globe like <span className="text-red-400">never before...</span>
        </h1>
  
        <div className="content flex flex-col md:flex-row items-center md:items-start mt-5">
          <div className="img w-full md:w-[25vw] lg:w-[20vw] h-[30vh] md:h-[35vh] lg:h-[30vh] mt-4 md:mt-0">
            <img className="h-full w-full rounded-lg object-cover" src={image} alt="Dish illustration" />
          </div>
          <div className="innerContent mt-4 md:mt-0 md:ml-4">
            <ul className="font-bold text-xl sm:text-2xl md:text-2xl ml-0 md:ml-6 px-5">
              <li className="text-yellow-500 py-1">Review</li>
              <li className="text-red-500 py-1">Share</li>
              <li className="py-1">Comments</li>
            </ul>

          </div>
        </div>
      </div>
  
      {/* Right Section (Login Form) */}
      <div className="loginForm w-full md:w-[40%] lg:w-[30%] h-[60vh] sm:h-[55vh] flex justify-center md:justify-evenly items-center mt-8 md:mt-0">
        <div className="innerdiv w-[90%] sm:w-[75%] md:w-[90%] lg:w-[100%] h-[100] rounded-xl shadow-xl py-5 px-6 bg-white ">
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
                className="w-full h-[6vh] pl-3 rounded-md bg-white border-2 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                  className="w-full h-[6vh] pl-3 rounded-md bg-white border-2 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
  );
};

export default Signup;
