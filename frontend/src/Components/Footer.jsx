import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagramSquare,
  faLinkedinIn,
  faGithubSquare,
} from "@fortawesome/free-brands-svg-icons";
import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const path = useLocation().pathname;

  const handleRating = (rate) => {
    setRating(rate);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form from refreshing the page


     // Check for mandatory fields
     if (!name || !email || !message || rating === 0) {
      alert("Name, Email, Message, and Rating are mandatory fields!");
      return; // Exit the function if validation fails
    }

    // Log the submitted data to the console
    console.log("Submitted Data:", {
      name,
      email,
      message,
      rating,
    });

    // Optionally, you can reset the form after submission
    setName("");
    setEmail("");
    setMessage("");
    setRating(0);
    setShowModal(false); // Close the modal after submission
  };

  return (
    <div>
      {path !== "/user" && (
        <>
          <footer className="text-gray-600 body-font">
            <div className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
              <span className="flex title-font font-bold items-center md:justify-start justify-center text-red-700">
                <span className="ml-3 text-xl font-[Mrriweather]">TastyTrails</span>
              </span>
              <p className="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4 sm:text-center">
                © {new Date().getFullYear()} TastyTrails Developer —
                <Link
                  to="https://twitter.com/A_l_f_i_y_a"
                  className="text-gray-600 ml-1 sm:text-center"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  @A_l_f_i_y_A
                </Link>
              </p>
              <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
                <Link
                  to={"https://www.instagram.com/alfiya.17.siddiq/"}
                  className="text-ref-500 text-red-700"
                >
                  <FontAwesomeIcon icon={faInstagramSquare} />
                </Link>
                <Link
                  to={"https://www.linkedin.com/in/alfiya-siddique-987a59240/"}
                  className="ml-3 text-red-700"
                >
                  <FontAwesomeIcon icon={faLinkedinIn} className="" />
                </Link>
                <Link
                  to={"https://github.com/AlfiyaSiddique"}
                  className="ml-3 text-red-700"
                >
                  <FontAwesomeIcon icon={faGithubSquare} />
                </Link>
              </span>

              {/* Contact Us / Rate Us Button */}
              <button
                onClick={() => setShowModal(true)}
                className="ml-4 py-2 px-4 bg-transparent border border-red-700 text-red-700 rounded hover:bg-red-700 hover:text-white"
              >
                Feedback
              </button>
            </div>
          </footer>

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4">Feedback</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-gray-700">Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded"
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)} // Update name state
                      required // HTML5 required attribute
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded"
                      placeholder="Your Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)} // Update email state
                      required // HTML5 required attribute
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700">Message</label>
                    <textarea
                      className="w-full px-4 py-2 border border-gray-300 rounded"
                      placeholder="Your Message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)} // Update message state
                      required // HTML5 required attribute
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-gray-700">Rate Us</label>
                    <div className="flex text-2xl"> {/* Increased star size here */}
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`cursor-pointer ${
                            rating >= star ? "text-yellow-400" : "text-gray-400"
                          }`}
                          onClick={() => handleRating(star)}
                        >
                          {rating >= star ? "★" : "☆"}
                        </span>
                      ))}
                    </div>
                    {!rating && (
                      <p className="text-red-600 text-sm">Rating is required!</p>
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
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Footer;
