import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import validate from "../../common/validation.js";
import axios from "axios";
import { toast } from "react-toastify";

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
    if (name === "cpassword") {
      message = validate.cpasssword(value, form.password);
    } else if (name === "username") {
      message = await validate.username(value.trim());  // Trim spaces
    } else {
      message = validate[name](value);
    }
    setError((prev) => {
      return { ...prev, ...message };
    });

    setForm((prev) => {
      return { ...prev, [name]: value };
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
      const trimmedUsername = form.username.trim().toLowerCase(); // Trim and lowercase username

      // Check if the trimmed, case-insensitive username exists
      if (usernames.some((uname) => uname.toLowerCase() === trimmedUsername)) {
        toast.error("Username already exists, please try another.");
      } else {
        axios
          .post(`${backendURL}/api/signup`, { ...form, username: trimmedUsername })
          .then((res) => {
            if (res.data.success) {
              toast.success("User Created Successfully");
              localStorage.setItem(
                "tastytoken",
                JSON.stringify(res.data.token)
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

  return (
    <div>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
          <div className="w-full bg-white rounded-lg shadow-2xl dark:border md:m-6 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-red-700 md:text-2xl dark:text-white font-[Merriweather]">
                Create an Account
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
                      onFocus={() => setPasswordFocused(true)}
                      value={form.password}
                      onChange={handleChange}
                      required={true}
                    />
                    <FontAwesomeIcon
                      icon={show ? faEyeSlash : faEye}
                      className="absolute top-3 right-2 cursor-pointer"
                      onClick={() => setShow((prev) => !prev)}
                    />
                  </div>
                  {error.password && (
                    <p className="text-red-500 text-sm">{error.passwordError}</p>
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
                    type={show ? "text" : "password"}
                    name="cpassword"
                    id="cpassword"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors duration-200 ease-in-out"
                    value={form.cpassword}
                    onChange={handleChange}
                    required={true}
                  />
                  {error.cpassword && (
                    <p className="text-red-500 text-sm">
                      {error.cpasswordError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 transition-colors duration-200 ease-in-out"
                >
                  Create Account
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Sign in here
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Signup;
