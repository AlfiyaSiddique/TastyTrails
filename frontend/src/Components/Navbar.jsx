import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faPenSquare,
  faUserCircle,
  faBell,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const Navbar = () => {
  const path = useLocation().pathname;
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const navigator = useNavigate();
  const [user, setUser] = useState(null);
  const [isSticky, setIsSticky] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
   

    <nav
      style={{
        position: isSticky ? "sticky" : "relative",
        top: isSticky ? 0 : "auto",
        zIndex: 1000,
        backgroundColor: isSticky ? "#fed4d4" : "#fed4d4",
        boxShadow: isSticky ? "0 4px 6px rgba(0, 0, 0, 0.3)" : "none",
        transition: "background-color 0.3s, box-shadow 0.3s",
      }}
    >
      <header className="text-gray-600 body-font">
        <div className="container mx-auto flex items-center justify-between p-5">
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={handleMenuToggle} className="text-red-700">
              <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} size="lg" />
            </button>
          </div>

          {/* Slide-in Menu and Overlay */}
          <div
            className={`fixed inset-0 z-40 transition-all duration-300 transform ${menuOpen ? "translate-x-0" : "-translate-x-full"
              } flex flex-col top-0 left-0 bg-white w-[250px] h-full p-5`}
          >
            {/* Close button inside the menu */}
            <div className="flex justify-end">
              <button onClick={handleMenuToggle} className="text-red-700">
                <FontAwesomeIcon icon={faTimes} size="lg" />
              </button>
            </div>

            {/* Navigation links with enhanced mobile styling */}
            <nav className="flex flex-col space-y-6 mt-8 text-lg">
              <NavLink
                to="/recipes"
                className={({ isActive }) =>
                  `hover:text-red-700 font-semibold ${isActive ? "text-red-700" : "text-black"
                  }`
                }
                onClick={handleLinkClick}
              >
                Recipes
              </NavLink>
              <NavLink
                to="/mainmeals"
                className={({ isActive }) =>
                  `hover:text-red-700 font-semibold ${isActive ? "text-red-700" : "text-black"
                  }`
                }
                onClick={handleLinkClick}
              >
                Main Meals
              </NavLink>
              <NavLink
                to="/smallbites"
                className={({ isActive }) =>
                  `hover:text-red-700 font-semibold ${isActive ? "text-red-700" : "text-black"
                  }`
                }
                onClick={handleLinkClick}
              >
                Small Bites
              </NavLink>
              <NavLink
                to="/healthy"
                className={({ isActive }) =>
                  `hover:text-red-700 font-semibold ${isActive ? "text-red-700" : "text-black"
                  }`
                }
                onClick={handleLinkClick}
              >
                Healthy
              </NavLink>
              <NavLink
                to="/recipe-suggestions"
                className={({ isActive }) =>
                  `mr-5 hover:text-red-700 font-semibold ${isActive ? "text-red-700" : "text-black"
                  }`
                }
                onClick={handleLinkClick}
              >
                Recipe bot
              </NavLink>
              <NavLink
                to="/search"
                className={({ isActive }) =>
                  `mr-5 hover:text-red-700 font-semibold ${
                    isActive ? "text-red-700" : "text-black"
                  }`
                }
                onClick={handleLinkClick}
              >
                Search
              </NavLink>
            </nav>
          </div>

          {/* Overlay */}
          {menuOpen && (
            <div
              className="fixed inset-0 z-30 bg-black bg-opacity-50"
              onClick={handleMenuToggle}
            />
          )}

          {/* Logo */}
          <div className="flex title-font font-medium items-center text-red-700 md:mb-0">
            <span className="ml-3 text-xl font-bold">
              <Link to="/" className="font-[Merriweather]">
                TastyTrails{" "}
              </Link>
            </span>
          </div>

          {/* Desktop navigation */}
          <nav
            className={
              "hidden md:flex md:flex-row md:ml-auto md:mr-auto items-center text-base justify-center"
            }
          >
            <NavLink
              to="/recipes"
              className={({ isActive }) =>
                `mr-5 hover:text-red-700 font-semibold ${isActive ? "text-red-700" : "text-black"
                }`
              }
            >
              Recipes
            </NavLink>
            <NavLink
              to="/mainmeals"
              className={({ isActive }) =>
                `mr-5 hover:text-red-700 font-semibold ${isActive ? "text-red-700" : "text-black"
                }`
              }
            >
              Main Meals
            </NavLink>
            <NavLink
              to="/smallbites"
              className={({ isActive }) =>
                `mr-5 hover:text-red-700 font-semibold ${isActive ? "text-red-700" : "text-black"
                }`
              }
            >
              Small Bites
            </NavLink>
            <NavLink
              to="/healthy"
              className={({ isActive }) =>
                `mr-5 hover:text-red-700 font-semibold ${isActive ? "text-red-700" : "text-black"
                }`
              }
            >
              Healthy
            </NavLink>
            <NavLink
              to="/recipe-suggestions"
              className={({ isActive }) =>
                `mr-5 hover:text-red-700 font-semibold ${isActive ? "text-red-700" : "text-black"
                }`
              }
              onClick={handleLinkClick}
            >
              Recipe bot
            </NavLink>
            <NavLink
              to="/search"
              className={({ isActive }) =>
                `mr-5 hover:text-red-700 font-semibold ${
                  isActive ? "text-red-700" : "text-black"
                }`
              }
              onClick={handleLinkClick}
            >
              Search
            </NavLink>
          </nav>

          {/* User profile actions */}
          {user === null ? (
            <div className="flex items-center">
              <Link
                to={path === "/" || path === "/signup" ? "/login" : "/signup"}
              >
                <button className="inline-flex items-center bg-red-700 border-0 py-1 px-3 focus:outline-none hover:bg-red-500 rounded text-white md:mt-0 transition-all">
                  {path === "/" || path === "/signup" ? "Login" : "Sign Up"}
                  <FontAwesomeIcon icon={faArrowRight} className="mx-2" />
                </button>
              </Link>
            </div>
          ) : (
            <div className="flex justify-center items-center">
              <div
                onClick={() =>
                  navigator(`/user/${user._id}`, { state: { user } })
                }
                className="mx-2 cursor-pointer"
              >
                <FontAwesomeIcon
                  icon={faUserCircle}
                  className="mx-2 text-red-700 text-lg"
                />
                <span className="text-black font-semibold">Profile</span>
              </div>
              <div
                onClick={() =>
                  navigator(`/user/${user._id}/new/recipe`, { state: { user } })
                }
                className="mx-2 cursor-pointer"
              >
                <FontAwesomeIcon
                  icon={faPenSquare}
                  className="mx-2 text-red-700 text-lg"
                />
                <span className="text-black font-semibold">Add Recipe</span>
              </div>
              <div
                onClick={() => navigator(`/notifications`)}
                className="ml-4 cursor-pointer"
              >
                <FontAwesomeIcon
                  icon={faBell}
                  className="text-black-700 text-lg"
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
