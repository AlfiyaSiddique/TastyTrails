import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import {
  faInstagramSquare,
  faLinkedinIn,
  faGithubSquare,
} from "@fortawesome/free-brands-svg-icons";
import { Link, useLocation } from "react-router-dom";
import GoogleTranslate from "./GoogleTranslate";

const Footer = () => {
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitStatus, setSubmitStatus] = useState(null);
  const path = useLocation().pathname;

  const handleRating = (rate) => setRating(rate);

  const openModal = () => {
    setSubmitStatus(null);
    setShowModal(true);
    setName("");
    setEmail("");
    setMessage("");
    setRating(0);
  };

  return (
    <div className={`w-full ${path !== "/user" ? "relative" : "fixed bottom-0"}`}>
      {path !== "/user" && (
        <footer className="bg-[#fed4d4] w-full py-2">
          <div className="container mx-auto flex flex-wrap sm:flex-nowrap justify-evenly items-start px-5">
            
            {/* Brand, Description, and Links */}
            <div className="flex flex-col text-red-700 space-y-4 w-full sm:w-2/4 lg:w-2/4 ml-2 mt-6 mr-8">
              <h1 className="text-xl font-bold">TastyTrails</h1>
              <p className="text-sm text-gray-500 leading-relaxed">
                TastyTrails is more than just recipes — it’s a vibrant social network where food lovers can connect, discover, and share the unique flavors of their cultures. A platform for passionate food enthusiasts to dive into a world of tastes!
              </p>
            </div>

            <div className="flex flex-col text-gray-600  sm:ml-8 w-full sm:w-1/4 lg:w-1/4 mt-6">
              <ul className="space-y-1">
              <h2 className="font-semibold text-gray-900 mb-2">About</h2>
                <li><a href="/privacy-policy">Privacy Policy</a></li>
                <li><a href="/contributors">Contributors</a></li>
              </ul>
            </div>

            {/* Categories Section */}
            <div className="flex flex-col text-gray-600 sm:ml-8 w-full sm:w-1/4 lg:w-1/4 mt-6">
              <ul className="space-y-1">
              <h2 className="font-semibold text-gray-900 mb-2">Links</h2>
                <li><a href="/recipes">Recipes</a></li>
                <li><a href="/mainmeals">Main Meal</a></li>
                <li><a href="/smallbites">Small Bites</a></li>
                <li><a href="/healthy">Healthy</a></li>
                <li><a href="/recipe-suggestions">Recipe Bot</a></li>
              </ul>
            </div>


            {/* Google Translate (Optional Divider for Styling) */}
            <div className="flex flex-col w-full mt-6 sm:w-1/4 lg:w-1/4 mr-8">
                  <GoogleTranslate />
              </div>

            {/* Social Links and Feedback */}
            <div className="flex flex-col text-gray-700 mt-6 w-full sm:w-1/4 lg:w-1/4">
              <h2 className="font-semibold text-gray-900 mb-2">Connect</h2>
              <div className="flex items-center space-x-4">
                <Link to="https://www.instagram.com/alfiya.17.siddiq/" className="text-2xl text-red-700 hover:text-red-500">
                  <FontAwesomeIcon icon={faInstagramSquare} />
                </Link>
                <Link to="https://www.linkedin.com/in/alfiya-siddique-987a59240/" className="text-2xl text-red-700 hover:text-red-500">
                  <FontAwesomeIcon icon={faLinkedinIn} />
                </Link>
                <Link to="https://github.com/AlfiyaSiddique" className="text-2xl text-red-700 hover:text-red-500">
                  <FontAwesomeIcon icon={faGithubSquare} />
                </Link>
              </div>
              <button
                onClick={openModal}
                className="mt-4 py-2 px-2 inline-block bg-transparent border border-red-700 text-red-700 rounded hover:bg-red-700 hover:text-white transition-all duration-200 max-w-[8rem] "
              >
                Feedback
              </button>
            </div>
          </div>

          {/* Copyright Row */}
          <div className="bg-red-700 w-full flex flex-col sm:flex-row justify-center items-center mt-6 mb-0 p-2">
            <span className="text-sm text-white">
              © {new Date().getFullYear()} TastyTrails Developer -
            </span>
            <Link
              to="https://twitter.com/A_l_f_i_y_a"
              className="text-gray-200 ml-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              @A_l_f_i_y_A
            </Link>
          </div>

          {/* Feedback Modal */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg w-full max-w-lg">
                {submitStatus === null ? (
                  <>
                    <h2 className="text-2xl font-bold mb-4">Feedback</h2>
                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                      <div>
                        <label className="block text-gray-700">Name</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded"
                          placeholder="Your Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700">Email</label>
                        <input
                          type="email"
                          className="w-full px-4 py-2 border border-gray-300 rounded"
                          placeholder="Your Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700">Message</label>
                        <textarea
                          className="w-full px-4 py-2 border border-gray-300 rounded"
                          placeholder="Your Message"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          required
                        ></textarea>
                      </div>

                      <div>
                        <label className="block text-gray-700">Rate Us</label>
                        <div className="flex text-2xl">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={`cursor-pointer ${rating >= star ? "text-yellow-400" : "text-gray-400"}`}
                              onClick={() => handleRating(star)}
                            >
                              {rating >= star ? "★" : "☆"}
                            </span>
                          ))}
                        </div>
                        {!rating && (
                          <p className="text-red-600 text-sm">
                            Rating is required!
                          </p>
                        )}
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          className="mr-4 py-2 px-4 bg-red-500 text-white rounded hover:bg-red-700"
                          onClick={() => setShowModal(false)}
                        >
                          Close
                        </button>
                        <button
                          type="submit"
                          className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700"
                        >
                          Submit
                        </button>
                      </div>
                    </form>
                  </>
                ) : submitStatus === "success" ? (
                  <div className="text-center">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-5xl mb-4" />
                    <h2 className="text-2xl font-bold mb-4">
                      Feedback sent successfully!
                    </h2>
                    <button
                      className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700"
                      onClick={() => setShowModal(false)}
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <FontAwesomeIcon icon={faTimesCircle} className="text-red-500 text-5xl mb-4" />
                    <h2 className="text-2xl font-bold mb-4">
                      Error in sending Feedback!
                    </h2>
                    <button
                      className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700"
                      onClick={() => setShowModal(false)}
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </footer>
      )}
    </div>
  );
};

export default Footer;
