import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import validate from "../../common/validation.js";
import axios from "axios";
import { toast } from "react-toastify";
import useGoogleAuth from "../../common/useGoogleAuth";

const Signup = () => {
  const navigator = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [passwordFocused, setPasswordFocused] = useState(false);
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
        localStorage.setItem(
          "username",
          JSON.stringify(res.data.user.username)
        );
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
    <div>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow-2xl dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="font-[Merriweather] text-xl font-bold leading-tight tracking-tight text-red-700 md:text-2xl dark:text-white">
                Create an account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                {/* First Name and Last Name Side by Side */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors duration-200 ease-in-out"
                      placeholder="Ex. John"
                      value={form.firstName}
                      onChange={handleChange}
                      required={true}
                    />
                    {error.firstName && (
                      <p className="text-red-500 text-sm">
                        {error.firstNameError}
                      </p>
                    )}
                  </div>

                  <div className="flex-1">
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors duration-200 ease-in-out"
                      placeholder="Ex. Doe"
                      value={form.lastName}
                      onChange={handleChange}
                      required={true}
                    />
                    {error.lastName && (
                      <p className="text-red-500 text-sm">
                        {error.lastNameError}
                      </p>
                    )}
                  </div>
                </div>

                {/* Username Field */}
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors duration-200 ease-in-out"
                    placeholder="Ex. jhonedoe12"
                    value={form.username}
                    onChange={handleChange}
                    required={true}
                  />
                  {error.username && (
                    <p className="text-red-500 text-sm">
                      {error.usernameError}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors duration-200 ease-in-out"
                    placeholder="abc@gmail.com"
                    value={form.email}
                    onChange={handleChange}
                    required={true}
                  />
                  {error.email && (
                    <p className="text-red-500 text-sm">{error.emailError}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={show ? "text" : "password"}
                      name="password"
                      id="password"
                      placeholder="••••••••"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors duration-200 ease-in-out"
                      required={true}
                      value={form.password}
                      onChange={handleChange}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                    />
                    <FontAwesomeIcon
                      icon={show ? faEye : faEyeSlash}
                      onClick={() => setShow(!show)}
                      className="absolute top-0 right-0 m-3 cursor-pointer"
                    />
                  </div>
                  {error.password && (
                    <div className="text-red-500 text-sm mt-2">
                      <ul className="list-disc list-inside">
                        <li>Minimum 8 characters</li>
                        <li>At least 1 uppercase letter</li>
                        <li>At least 1 lowercase letter</li>
                        <li>At least 1 number</li>
                        <li>At least 1 symbol</li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label
                    htmlFor="cpassword"
                    className="block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="cpassword"
                    id="cpassword"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors duration-200 ease-in-out"
                    required={true}
                    value={form.cpassword}
                    onChange={handleChange}
                  />
                  {error.cpassword && (
                    <p className="error text-red-500 text-sm mt-0 mb-2">
                      {error.cpasswordError}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full text-white bg-red-700 hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-pt-gray-900 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Sign Up
                </button>
              </form>
              <button
                onClick={() => googleSignup()}
                className="w-full text-white bg-red-700 hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 "
              >
                <img
                  src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000"
                  className="w-8 h-8 mr-2 inline-block"
                />{" "}
                Sign up with Google
              </button>
              {/* Already Have an Account */}
              <p className="text-sm text-center font-light text-gray-500 dark:text-gray-400">
                Already Have an Account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-pt-gray-900 hover:underline dark:text-primary-500 hover:text-red-700"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Signup;
