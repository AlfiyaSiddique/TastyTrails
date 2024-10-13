import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagramSquare,
  faLinkedinIn,
  faGithubSquare,
  faTwitterSquare,
  faFacebookSquare,
} from "@fortawesome/free-brands-svg-icons";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const Footer = () => {
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
    toast.success("Feedback submitted successfully.");

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
    <div className={`${isSticky ? "fixed bottom-0 w-full" : ""} bg-white`}>
      {path !== "/user" && (
        <>
          {/* Divider line */}
          <hr className="border-t border-gray-300 my-4" />
          
          <footer className="text-gray-600 body-font bg-gray-100">
            <div className="container mx-auto px-5 py-8 flex flex-col sm:flex-row justify-between items-center">
              <span className="flex title-font font-bold items-center text-red-700 hover:text-red-800 transition-colors duration-300 transform hover:scale-105">
                <span className="ml-3 text-xl font-[Mrriweather]">TastyTrails</span>
              </span>
              <p className="text-sm text-gray-500 mt-4 sm:mt-0">
                © {new Date().getFullYear()} TastyTrails Developer —
                <Link
                  to="https://twitter.com/A_l_f_i_y_a"
                  className="text-gray-600 ml-1 hover:text-red-700 transition-colors duration-300 hover:underline"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  @A_l_f_i_y_A
                </Link>
              </p>
              <div className="flex justify-center sm:justify-start space-x-4 mt-4 sm:mt-0">
                <SocialIcon to="https://www.instagram.com/alfiya.17.siddiq/" icon={faInstagramSquare} hoverColor="hover:text-pink-600" />
                <SocialIcon to="https://www.linkedin.com/in/alfiya-siddique-987a59240/" icon={faLinkedinIn} hoverColor="hover:text-blue-600" />
                <SocialIcon to="https://github.com/AlfiyaSiddique" icon={faGithubSquare} hoverColor="hover:text-gray-800" />
                <SocialIcon to="#" icon={faTwitterSquare} hoverColor="hover:text-blue-400" />
                <SocialIcon to="#" icon={faFacebookSquare} hoverColor="hover:text-blue-800" />
              </div>
              {/* Feedback Button */}
              <button
                onClick={() => setShowModal(true)}
                className="ml-4 py-2 px-4 bg-red-700 text-white rounded hover:bg-red-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
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
                    />
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
                    {!rating && <p className="text-red-600 text-sm">Rating is required!</p>}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="mr-4 py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-700 transition-colors duration-300"
                      onClick={() => setShowModal(false)}
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="py-2 px-4 bg-red-700 text-white rounded hover:bg-red-800 transition-colors duration-300"
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

const SocialIcon = ({ to, icon, hoverColor }) => (
  <Link 
    to={to} 
    className={`text-red-700 ${hoverColor} transition-all duration-300 transform hover:scale-110 hover:rotate-6`}
  >
    <FontAwesomeIcon 
      icon={icon} 
      size="lg" 
      className="filter hover:drop-shadow-md"
    />
  </Link>
);

export default Footer;