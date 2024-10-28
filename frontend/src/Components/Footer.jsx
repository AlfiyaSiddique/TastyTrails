import React, { useState, useEffect } from "react";
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
import { toast } from "react-toastify";
import GoogleTranslate from "./GoogleTranslate";

const Footer = () => {
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isSticky, setIsSticky] = useState(false);
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const path = useLocation().pathname;

  useEffect(() => {
    const handleResize = () => {
      const contentHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      setIsSticky(contentHeight <= viewportHeight);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleRating = (rate) => {
    setRating(rate);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message || rating === 0 || message.length < 5) {   // Added check for message length
      toast.error("Name, Email, Message (at least 5 characters), and Rating are mandatory fields!");  // Replaced alert with toast notification
      return;
    }

    const formData = {
      name,
      email,
      message,
      rating,
    };

    try {
      //This is the URL you can use if you are working on local machine if creating error in finding backendURL so use this in fetch request = 'http://localhost:8080/api/feedback
      const response = await fetch(`${backendURL}/api/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        setSubmitStatus("success");
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error sending form data:", error);
      setSubmitStatus("error");
    }
  };

  const openModal = () => {
    setSubmitStatus(null);
    setShowModal(true);

    setName("");
    setEmail("");
    setMessage("");
    setRating(0);
    setShowModal(true);
  };

  return (
    <div className={`w-full ${path !== "/user" ? "relative" : "fixed bottom-0"}`}>
      {path !== "/user" && (
        <>
          <footer className="text-gray-600 body-font w-full bg-[#fed4d4]">
          <div className="container px-2 py-4 flex flex-col sm:flex-row items-center justify-between">
              <div className="flex title-font font-bold items-center justify-center md:justify-start text-red-700 max-sm:flex-col">
                <span className="ml-3 text-xl font-[Merriweather]">TastyTrails</span>
                <div className="hidden sm:block h-6 border-l-2 border-gray-300 mx-4"></div>
                <div className="flex items-center sm:ml-4">
                  <Link
                    to="/privacy-policy"
                    className="inline-flex items-center text-red-700 hover:text-red-500 transition-all duration-200 text-md mx-2"
                  >
                    Privacy Policy
                  </Link>
                  <Link to="/contributors">
                    <button className="inline-flex items-center text-red-700 hover:text-red-500 transition-all duration-200 text-md mx-2">
                      Contributors
                    </button>
                  </Link>
                </div>
              </div>


              <div className="flex items-center max-sm:flex-col mt-4 sm:mt-0 justify-start">
                <div className="flex my-auto">
                  <div className="sm:block h-6  mx-4 ml-0"></div>
                  <GoogleTranslate />
                </div>
                <div className="flex mx-8">
                  <Link
                    to={"https://www.instagram.com/alfiya.17.siddiq/"}
                    className="text-red-700 text-3xl ml-8 hover:text-red-500 transition-colors duration-200"
                  >
                    <FontAwesomeIcon icon={faInstagramSquare} />
                  </Link>
                  <Link
                    to={"https://www.linkedin.com/in/alfiya-siddique-987a59240/"}
                    className="ml-6 text-red-700 text-3xl hover:text-red-500 transition-colors duration-200"
                  >
                    <FontAwesomeIcon icon={faLinkedinIn} />
                  </Link>
                  <Link
                    to={"https://github.com/AlfiyaSiddique"}
                    className="ml-6 text-red-700 text-3xl hover:text-red-500 transition-colors duration-200"
                  >
                    <FontAwesomeIcon icon={faGithubSquare} />
                  </Link>
                </div>
                <button
                  onClick={openModal}  // Call openModal when feedback button is clicked
                  className="ml-4 py-2 px-4 bg-transparent border border-red-700 text-red-700 rounded hover:bg-red-700 hover:text-white transition-all duration-200"
                >
                  Feedback
                </button>
              </div>
            </div>

            {/* Copyright Row */}
            <div className="text-center py-2">
              <span className="text-sm text-gray-500">© {new Date().getFullYear()} TastyTrails Developer - </span>
              <Link
                to="https://twitter.com/A_l_f_i_y_a"
                className="text-gray-600 ml-1 sm:text-center px-0"
                rel="noopener noreferrer"
                target="_blank"
              >
                @A_l_f_i_y_A
              </Link>
            </div>
          </footer>

          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg w-full max-w-lg">
                {submitStatus === null ? (
                  <>
                    <h2 className="text-2xl font-bold mb-4">Feedback</h2>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                      <div>
                        <label className="block text-gray-700">Name</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded"
                          placeholder="Your Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          pattern="[a-zA-Z ]+"
                          oninvalid="this.setCustomValidity('Numbers and Symbols are not allowed')"
                          oninput="this.setCustomValidity('')"
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
                              className={`cursor-pointer ${rating >= star
                                ? "text-yellow-400"
                                : "text-gray-400"
                                }`}
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
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 text-5xl mb-4"
                    />
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
                    <FontAwesomeIcon
                      icon={faTimesCircle}
                      className="text-red-500 text-5xl mb-4"
                    />
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
        </>
      )}
    </div>
  );
};

export default Footer;