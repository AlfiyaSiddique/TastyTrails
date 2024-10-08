import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import validate from "../../common/validation.js";
import axios from "axios";
import { toast } from "react-toastify";

const Signup = ({ darkMode }) => {
  const navigator = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [show, setShow] = useState(false); 
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const [error, setError] = useState({
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
    const { name, value } = e.target;
    let message = {};
    if (name === "cpassword") {
      message = validate.cpassword(value, form.password);
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

  const getUsernames = async () => {
    return await axios
      .get(`${backendURL}/api/usernames`)
      .then((data) => data.data.usernames)
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmit = async (e) => {
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
        toast.error("Username already exists, please try another.");
      } else {
        axios
          .post(`${backendURL}/api/signup`, form)
          .then((res) => {
            if (res.data.success) {
              toast.success("User Created Successfully");
              localStorage.setItem("tastytoken", JSON.stringify(res.data.token));
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
      toast.error("Fill all fields with valid values.");
    }
  };

  return (
    <div>
      <section className={darkMode ? "bg-gray-900" : "bg-gray-50"}>
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
          <div className={`w-full rounded-lg shadow-2xl sm:max-w-md xl:p-0 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className={`text-xl font-bold leading-tight tracking-tight md:text-2xl ${darkMode ? "text-white" : "text-red-700"} font-[Merriweather]`}>
                Create an Account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                {/* First Name and Last Name */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label
                      htmlFor="firstName"
                      className={`block text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      className={`bg-gray-50 border sm:text-sm rounded-lg block w-full p-2.5 transition-colors duration-200 ease-in-out ${
                        darkMode ? "bg-gray-700 border-gray-600 text-white" : "text-gray-900"
                      }`}
                      placeholder="Ex. John"
                      value={form.firstName}
                      onChange={handleChange}
                      required
                    />
                    {error.firstName && <p className="text-red-500 text-sm">{error.firstNameError}</p>}
                  </div>

                  <div className="flex-1">
                    <label
                      htmlFor="lastName"
                      className={`block text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      className={`bg-gray-50 border sm:text-sm rounded-lg block w-full p-2.5 transition-colors duration-200 ease-in-out ${
                        darkMode ? "bg-gray-700 border-gray-600 text-white" : "text-gray-900"
                      }`}
                      placeholder="Ex. Doe"
                      value={form.lastName}
                      onChange={handleChange}
                      required
                    />
                    {error.lastName && <p className="text-red-500 text-sm">{error.lastNameError}</p>}
                  </div>
                </div>

                {/* Username */}
                <div>
                  <label
                    htmlFor="username"
                    className={`block text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    className={`bg-gray-50 border sm:text-sm rounded-lg block w-full p-2.5 transition-colors duration-200 ease-in-out ${
                      darkMode ? "bg-gray-700 border-gray-600 text-white" : "text-gray-900"
                    }`}
                    placeholder="Ex. jhonedoe12"
                    value={form.username}
                    onChange={handleChange}
                    required
                  />
                  {error.username && <p className="text-red-500 text-sm">{error.usernameError}</p>}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className={`block text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`bg-gray-50 border sm:text-sm rounded-lg block w-full p-2.5 transition-colors duration-200 ease-in-out ${
                      darkMode ? "bg-gray-700 border-gray-600 text-white" : "text-gray-900"
                    }`}
                    placeholder="abc@gmail.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                  {error.email && <p className="text-red-500 text-sm">{error.emailError}</p>}
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className={`block text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={show ? "text" : "password"}
                      id="password"
                      name="password"
                      className={`bg-gray-50 border sm:text-sm rounded-lg block w-full p-2.5 transition-colors duration-200 ease-in-out ${
                        darkMode ? "bg-gray-700 border-gray-600 text-white" : "text-gray-900"
                      }`}
                      placeholder="••••••••"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                    <FontAwesomeIcon
                      icon={show ? faEye : faEyeSlash}
                      onClick={() => setShow(!show)}
                      className="absolute top-0 right-0 m-3 cursor-pointer"
                      style={{ color: darkMode ? "#fff" : "#000" }}
                    />
                  </div>
                  {error.password && (
                    <p className="text-red-500 text-sm">
                      Minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol.
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="cpassword"
                    className={`block text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="cpassword"
                    name="cpassword"
                    className={`bg-gray-50 border sm:text-sm rounded-lg block w-full p-2.5 transition-colors duration-200 ease-in-out ${
                      darkMode ? "bg-gray-700 border-gray-600 text-white" : "text-gray-900"
                    }`}
                    placeholder="••••••••"
                    value={form.cpassword}
                    onChange={handleChange}
                    required
                  />
                  {error.cpassword && <p className="text-red-500 text-sm">{error.cpasswordError}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Create an account
                </button>

                <p className={`text-sm font-light ${darkMode ? "text-white" : "text-gray-500"}`}>
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className={`font-medium hover:underline ${darkMode ? "text-primary-500" : "text-primary-600"}`}
                  >
                    Login here
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
