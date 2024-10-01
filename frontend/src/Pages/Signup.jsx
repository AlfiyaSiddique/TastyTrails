// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import validate from "../../common/validation";
import axios from "axios";
import { toast } from "react-toastify";
import backendURL from "../../common/backendUrl";

const Signup = () => {
  const navigator = useNavigate();
  const [show, setShow] = useState(false); //Eye EyeSlaSH Toggle
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
      message = await validate.username(value);
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
          <div className="w-full bg-white rounded-lg shadow dark:border md:m-6 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-red-700 md:text-2xl dark:text-white font-[Merriweather]">
                Create an Account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div className="flex flex-wrap -m-2">
                  <div className="px-2 w-full sm:w-1/2">
                    <div className="relative">
                      <label
                        htmlFor="firstName"
                        className="leading-7 text-sm text-gray-900"
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                        placeholder="Ex. Jhon"
                        value={form.firstName}
                        onChange={handleChange}
                        required={true}
                      />
                    </div>
                    {error.firstName && (
                      <p className="text-red-500 text-sm">
                        {error.firstNameError}
                      </p>
                    )}
                  </div>
                  <div className="px-2 sm:w-1/2 w-full">
                    <div className="relative">
                      <label
                        htmlFor="lastName"
                        className="leading-7 text-sm text-gray-900"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                        placeholder="Ex. Doe"
                        value={form.lastName}
                        onChange={handleChange}
                        required={true}
                      />
                    </div>
                    {error.lastName && (
                      <p className="text-red-500 text-sm">
                        {error.lastNameError}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap -m-2">
                  <div className="px-2 sm:w-1/2 w-full">
                    <div className="relative">
                      <label
                        htmlFor="username"
                        className="leading-7 text-sm text-gray-900"
                      >
                        Username
                      </label>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                        placeholder="Ex. jhonedoe12"
                        value={form.username}
                        onChange={handleChange}
                        required={true}
                      />
                    </div>
                    {error.username && (
                      <p className="text-red-500 text-sm">
                        {error.usernameError}
                      </p>
                    )}
                  </div>
                  <div className="px-2 sm:w-1/2 w-full">
                    <div className="relative">
                      <label
                        htmlFor="email"
                        className="leading-7 text-sm text-gray-900"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                        placeholder="abc@gmail.com"
                        value={form.email}
                        onChange={handleChange}
                        required={true}
                      />
                    </div>
                    {error.email && (
                      <p className="text-red-500 text-sm">{error.emailError}</p>
                    )}
                  </div>
                </div>
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
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-pt-gray-900 focus:border-pt-gray-900 block w-full p-2.5 dark:bg-gray-700 dark:bordet-gray-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                </div>
                {/* {error.password && (
                  <p className="error mb-2 text-red-500 text-sm mt-0">
                    {error.passwordError}
                  </p>
                )} */}
                
                {error.password && (<div className="text-red-500 text-sm mt-2">
    <ul className="list-disc list-inside">
      <li>Minimum 8 characters</li>
      <li>At least 1 uppercase letter</li>
      <li>At least 1 lowercase letter</li>
      <li>At least 1 number</li>
      <li>At least 1 symbol</li>
    </ul>
  </div>)}
                  
                
                
                <div>

                  <label
                    htmlFor="cpassword"
                    className="block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="cpassword"
                    name="cpassword"
                    id="cpassword"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-pt-gray-900 focus:border-pt-gray-900 block w-full p-2.5 dark:bg-gray-700 dark:bordet-gray-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required={true}
                    value={form.cpassword}
                    onChange={handleChange}
                  />
                </div>
                {error.cpassword && (
                  <p className="error text-red-500 text-sm mt-0 mb-2">
                    {error.cpasswordError}
                  </p>
                )}
                
                <button
                  type="submit"
                  className="w-full text-white bg-red-700 hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-pt-gray-900 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Sign Up
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Already Have an Account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-pt-gray-900 hover:underline dark:text-primary-500 hover:text-red-700"
                  >
                    Login
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
