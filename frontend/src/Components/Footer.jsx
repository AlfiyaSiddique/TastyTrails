import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagramSquare,
  faLinkedinIn,
  faGithubSquare,
} from "@fortawesome/free-brands-svg-icons";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useRecoilValue } from "recoil";
import { darkMode } from "../store/atom";

const Footer = () => {
  const mode = useRecoilValue(darkMode);
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSticky, setIsSticky] = useState(false);

  const path = useLocation().pathname;

  // Check if the content is smaller than the screen
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !message || rating === 0) {
      alert("Name, Email, Message, and Rating are mandatory fields!");
      return;
    }
    toast.success("Feedback submitted succesfully.");

    console.log("Submitted Data:", {
      name,
      email,
      message,
      rating,
    });

    setName("");
    setEmail("");
    setMessage("");
    setRating(0);
    setShowModal(false);
  };

  return (
    <div className={`${isSticky ? "fixed bottom-0 w-full" : ""} ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      {path !== "/user" && (
        <>
          <footer className={`body-font ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            <div className="container mx-auto px-5 py-6 flex flex-col sm:flex-row justify-between items-center">
              <span className="flex title-font font-bold items-center text-red-700">
                <span className="ml-3 text-xl font-[Merriweather]">TastyTrails</span>
              </span>
              <p className={`text-sm ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-4 sm:mt-0`}>
                © {new Date().getFullYear()} TastyTrails Developer —
                <Link
                  to="https://twitter.com/A_l_f_i_y_a"
                  className={`ml-1 ${mode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  @A_l_f_i_y_A
                </Link>
              </p>
              <div className="flex justify-center sm:justify-start space-x-4 mt-4 sm:mt-0">
                <Link to="https://www.instagram.com/alfiya.17.siddiq/" className="text-red-700">
                  <FontAwesomeIcon icon={faInstagramSquare} />
                </Link>
                <Link to="https://www.linkedin.com/in/alfiya-siddique-987a59240/" className="text-red-700">
                  <FontAwesomeIcon icon={faLinkedinIn} />
                </Link>
                <Link to="https://github.com/AlfiyaSiddique" className="text-red-700">
                  <FontAwesomeIcon icon={faGithubSquare} />
                </Link>
              </div>
              {/* Feedback Button */}
              <button
                onClick={() => setShowModal(true)}
                className={`ml-4 py-2 px-4 border ${mode === 'dark' ? 'border-gray-400 text-gray-300' : 'border-red-700 text-red-700'} rounded hover:bg-red-700 hover:text-white`}
              >
                Feedback
              </button>
            </div>
          </footer>
          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className={`p-6 rounded-lg w-full max-w-lg ${mode === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
                <h2 className={`text-2xl font-bold mb-4 ${mode === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>Feedback</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label className={`block ${mode === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Name</label>
                    <input
                      type="text"
                      className={`w-full px-4 py-2 border ${mode === 'dark' ? 'border-gray-600 bg-gray-800 text-gray-300' : 'border-gray-300'} rounded`}
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className={`block ${mode === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Email</label>
                    <input
                      type="email"
                      className={`w-full px-4 py-2 border ${mode === 'dark' ? 'border-gray-600 bg-gray-800 text-gray-300' : 'border-gray-300'} rounded`}
                      placeholder="Your Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className={`block ${mode === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Message</label>
                    <textarea
                      className={`w-full px-4 py-2 border ${mode === 'dark' ? 'border-gray-600 bg-gray-800 text-gray-300' : 'border-gray-300'} rounded`}
                      placeholder="Your Message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className={`block ${mode === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Rate Us</label>
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
                    {!rating && <p className="text-red-600 text-sm">Rating is required!</p>}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      className={`mr-4 py-2 px-4 ${mode === 'dark' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-red-500 text-white hover:bg-red-700'} rounded`}
                      onClick={() => setShowModal(false)}
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className={`py-2 px-4 ${mode === 'dark' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-700'} rounded`}
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
