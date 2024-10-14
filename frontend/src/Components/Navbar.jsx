// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faPenSquare,
  faUserCircle,
  faBell,
  faBars,
  faTimes,
  faComment,
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
      className={`z-50 relative ${
        isSticky ? "fixed top-0 left-0 w-full bg-white shadow-md" : ""
      }`}
    >
      <header className="text-gray-600 body-font">
        <div className="container mx-auto flex items-center justify-between p-5">
          <div className="md:hidden flex items-center">
            <button onClick={handleMenuToggle} className="text-red-700">
              <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} size="lg" />
            </button>
          </div>
          <nav
            className={`md:hidden ${
              menuOpen ? "block" : "hidden"
            } absolute flex flex-col top-14 left-5 bg-white border-2 shadow-md rounded-md px-5 py-3 space-y-2 w-[150px]`}
          >
            <Link
              to="/recipes"
              className="mr-5 hover:text-red-700 text-black font-semibold"
              onClick={handleLinkClick}
            >
              Recipes
            </Link>
            <Link
              to="/mainmeals"
              className="mr-5 hover:text-red-700 text-black font-semibold"
              onClick={handleLinkClick}
            >
              Main Meals
            </Link>
            <Link
              to="/smallbites"
              className="mr-5 hover:text-red-700 text-black font-semibold"
              onClick={handleLinkClick}
            >
              Small Bites
            </Link>
            <Link
              to="/healthy"
              className="mr-5 hover:text-red-700 text-black font-semibold"
              onClick={handleLinkClick}
            >
              Healthy
            </Link>
          </nav>
          <div className="flex title-font font-medium items-center text-red-700 md:mb-0">
            <span className="ml-3 text-xl font-bold">
              <Link to="/" className="font-[Merriweather]">
                TastyTrails{" "}
              </Link>
            </span>
          </div>

          {/* Links for larger screens */}
          <nav
            className={
              "hidden md:ml-auto md:mr-auto flex flex-col md:flex-row md:flex items-center text-base justify-center"
            }
          >
            <Link
              to="/recipes"
              className="mr-5 hover:text-red-700 text-black font-semibold"
              onClick={handleLinkClick}
            >
              Recipes
            </Link>
            <Link
              to="/mainmeals"
              className="mr-5 hover:text-red-700 text-black font-semibold"
              onClick={handleLinkClick}
            >
              Main Meals
            </Link>
            <Link
              to="/smallbites"
              className="mr-5 hover:text-red-700 text-black font-semibold"
              onClick={handleLinkClick}
            >
              Small Bites
            </Link>
            <Link
              to="/healthy"
              className="mr-5 hover:text-red-700 text-black font-semibold"
              onClick={handleLinkClick}
            >
              Healthy
            </Link>
          </nav>

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
                onClick={() =>
                  navigator(`/chat`, { state: { user } })
                }
                className="mx-2 cursor-pointer"
              >
                <FontAwesomeIcon
                  icon={faComment}
                  className="mx-2 text-red-700 text-lg"
                />
                <span className="text-black font-semibold">Chats</span>
              </div>
              <div
                onClick={() => navigator(`/notifications`)}
                className="ml-4 cursor-pointer"
              >
                <FontAwesomeIcon
                  icon={faBell}
                  className="text-Black-700 text-lg"
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
