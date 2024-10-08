
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const navigator = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const [show, setShow] = useState(false); //Eye EyeSlash Toggle
  const [form, setForm] = useState({
    searchTerm: "",
    password: "",
  });

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
    axios
      .post(`${backendURL}/api/login`, form)
      .then((res) => {
        if (res.data.success) {
          toast.success("Login Successful");
          localStorage.setItem("tastytoken", JSON.stringify(res.data.token));
          navigator(`/user/${res.data.user._id}`, {
            state: { user: res.data.user },
          });
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  return (
    <div>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow-2xl dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="font-[Merriweather] text-xl font-bold leading-tight tracking-tight text-red-700 md:text-2xl dark:text-white">
                Login to your account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Enter email or Username
                  </label>
                  <input
                    type="text"
                    name="searchTerm"
                    id="searchTerm"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors duration-200 ease-in-out"
                    placeholder="name@company.com"
                    required={true}
                    value={form.searchTerm}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
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
                    />
                    <FontAwesomeIcon
                      icon={show ? faEye : faEyeSlash}
                      onClick={() => setShow(!show)}
                      className="absolute top-0 right-0 m-3 cursor-pointer"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-red-700 hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 "
                >
                  Sign in
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don’t have an account yet?{" "}
                  <Link
                    to="/signup"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500 hover:text-red-700"
                  >
                    Sign up
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

export default Login;
