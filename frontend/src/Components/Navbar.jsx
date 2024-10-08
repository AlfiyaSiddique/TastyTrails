import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faPenSquare,
  faUserCircle,
  faBell,
  faSun,
  faMoon,
} from "@fortawesome/free-solid-svg-icons";

import axios from "axios";

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const path = useLocation().pathname;
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const navigator = useNavigate();
  const [user, setUser] = useState(null);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    let token = localStorage.getItem("tastytoken");
    if (token) {
      token = JSON.parse(token);
      axios
        .get(`${backendURL}/api/token`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.data.success) {
            setUser(() => {
              return { ...res.data.user };
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setUser(null);
    }
  }, [path]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


  return (
    <nav
      style={{
        zIndex: 50,
        position: isSticky ? "fixed" : "relative",
        top: 0,
        left: 0,
        width: "100%",
        boxShadow: isSticky ? "0 4px 12px rgba(0, 0, 0, 0.1)" : "none",
        backgroundColor: darkMode ? "#333" : "#fff", 
        color: darkMode ? "#fff" : "#000"
      }}
    >
      <header
        style={{
          color: darkMode ? "#e0e0e0" : "#4a4a4a",
        }}
      >
        <div className='container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center'>
          <div
            className='flex title-font font-medium items-center mb-4 md:mb-0'
            style={{ color: darkMode ? "#ff6347" : "#e53e3e" }}
          >
            <span className='ml-3 text-xl font-bold'>
              <Link to={"/"} className='font-[Merriweather]'>
                TastyTrails{" "}
              </Link>
            </span>
          </div>

          <nav className='md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center'>
            <Link
              to='/recipes'
              className={`mr-5 hover:text-red-700 font-semibold`}
              style={{
                color: darkMode ? "#e0e0e0" : "#000",
              }}
            >
              Recipes
            </Link>
            <Link
              to='/mainmeals'
              className={`mr-5 hover:text-red-700 font-semibold`}
              style={{
                color: darkMode ? "#e0e0e0" : "#000",
              }}
            >
              Main Meals
            </Link>
            <Link
              to='/smallbites'
              className={`mr-5 hover:text-red-700 font-semibold`}
              style={{
                color: darkMode ? "#e0e0e0" : "#000",
              }}
            >
              Small Bites
            </Link>
            <Link
              to='/healthy'
              className={`mr-5 hover:text-red-700 font-semibold`}
              style={{
                color: darkMode ? "#e0e0e0" : "#000",
              }}
            >
              Healthy
            </Link>
          </nav>

          {/* Dark mode button */}
          <button
            className='inline-flex items-center bg-gray-300 border-0 py-1 px-3 focus:outline-none hover:bg-gray-400 rounded-full transition-all'
            onClick={toggleDarkMode} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: darkMode ? '#fff' : '#000' }}
          >
            {darkMode ? '🌙 Dark' : '☀️ Light'}
          </button>

          {user === null ? (
            <div className='flex items-center'>
              <Link
                to={path == "/" || path == "/signup" ? "/login" : "/signup"}
              >
                <button
                  className='inline-flex items-center'
                  style={{
                    backgroundColor: "#e53e3e",
                    color: "#fff",
                    padding: "0.5rem 1.5rem",
                    borderRadius: "0.375rem",
                    transition: "background-color 0.3s",
                  }}
                >
                  {path === "/" || path == "/signup" ? "Login" : "Sign Up"}
                  <FontAwesomeIcon icon={faArrowRight} className='mx-2' />
                </button>
              </Link>
            </div>
          ) : (
            <div className='flex justify-center items-center'>
              <div
                onClick={() =>
                  navigator(`/user/${user._id}`, { state: { user } })
                }
                className='mx-2 cursor-pointer'
              >
                <FontAwesomeIcon
                  icon={faUserCircle}
                  className='mx-2 text-lg'
                  style={{ color: darkMode ? "#ff6347" : "#e53e3e" }}
                />
                <span
                  className='font-semibold'
                  style={{ color: darkMode ? "#e0e0e0" : "#000" }}
                >
                  Profile
                </span>
              </div>
              <div
                onClick={() =>
                  navigator(`/user/${user._id}/new/recipe`, { state: { user } })
                }
                className='mx-2 cursor-pointer'
              >
                <FontAwesomeIcon
                  icon={faPenSquare}
                  className='mx-2 text-lg'
                  style={{ color: darkMode ? "#ff6347" : "#e53e3e" }}
                />
                <span
                  className='font-semibold'
                  style={{ color: darkMode ? "#e0e0e0" : "#000" }}
                >
                  Add Recipe
                </span>
              </div>
              <div
                onClick={() => navigator(`/notifications`)}
                className='ml-4 cursor-pointer'
              >
                <FontAwesomeIcon
                  icon={faBell}
                  className='text-lg'
                  style={{ color: darkMode ? "#e0e0e0" : "#000" }}
                />
              </div>
            </div>
          )}
        </div>
      </header>
    </nav>
  );
};

export default Navbar;

