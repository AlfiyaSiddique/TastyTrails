import { React, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
const ForgotPassword = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [email, setemail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${backendURL}/api/forgot_password`, {
        email,
      })
      .then((res) => {
        if (res.data.success) {
          toast.success("Check email for instructions");
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
                Reset your password
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Enter Email
                  </label>
                  <input
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors duration-200 ease-in-out"
                    placeholder="name@company.com"
                    required={true}
                    onChange={(e) => setemail(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full text-white bg-red-700 hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 "
                >
                  Send
                </button>
              </form>

              <p className="text-sm text-center font-light text-gray-500 dark:text-gray-400">
                <Link
                  to="/login"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500 hover:text-red-700"
                >
                  Back to Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ForgotPassword;
