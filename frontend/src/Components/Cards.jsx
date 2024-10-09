// eslint-disable-next-line no-unused-vars
import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faHeart, faShare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Cards Component for Creating Recipe Cards
const Cards = ({ dish, darkMode }) => {
  const navigator = useNavigate();

  // Checks if user is authenticated or not
  const handleClick = async () => {
    const token = await JSON.parse(localStorage.getItem("tastytoken"));
    if (token !== null) {
      navigator(`/recipe/${dish._id}`, { state: { dish } });
    } else {
      toast.info("Please Login First");
      navigator("/login");
    }
  };

  return (
    <div
      className="p-4 cursor-pointer"
      onClick={handleClick}
      style={{
        backgroundColor: darkMode ? "#333" : "#fff", // Background changes based on darkMode
        color: darkMode ? "#fff" : "#000", // Text color changes based on darkMode
        borderRadius: "0.5rem", // Consistent rounded corners
        boxShadow: darkMode ? "0 2px 10px rgba(0, 0, 0, 0.8)" : "0 2px 10px rgba(0, 0, 0, 0.1)", // Shadow effect based on darkMode
      }}
    >
      <div
        className="border-2 border-opacity-60 rounded-lg overflow-hidden"
        style={{
          borderColor: darkMode ? "#555" : "#ccc", // Border color changes based on darkMode
        }}
      >
        <img
          className="lg:h-48 md:h-36 w-full object-cover object-center"
          src={dish.image}
          alt={dish.name}
          loading="lazy"
        />
        <div className="p-6">
          <h2
            className="tracking-widest text-xs title-font font-medium mb-1"
            style={{
              color: darkMode ? "#bbb" : "#555", // Subtle text color change for dark mode
            }}
          >
            {dish.type.join(", ")}
          </h2>
          <h1
            className="title-font text-lg font-medium mb-3"
            style={{
              color: darkMode ? "#fff" : "#000", // Primary text color change
            }}
          >
            {dish.name}
          </h1>
          <p className="leading-relaxed mb-3">
            {dish.description.slice(0, 174)}
            {dish.description.length > 174 ? "..." : null}
          </p>
          <div className="flex items-center flex-wrap">
            <span className="text-red-500 inline-flex items-center md:mb-2 lg:mb-0">
              Recipe <FontAwesomeIcon icon={faArrowRight} />
            </span>
            <span
              className="mr-3 inline-flex items-center lg:ml-auto md:ml-0 ml-auto leading-none text-sm pr-3 py-1 border-r-2 cursor-pointer"
              style={{
                color: darkMode ? "#bbb" : "#777", // Icon and text color change for darkMode
                borderColor: darkMode ? "#555" : "#ccc", // Border color changes based on darkMode
              }}
            >
              <FontAwesomeIcon icon={faHeart} className="mx-2" />
              {dish.likes}
            </span>
            <span
              className="inline-flex items-center leading-none text-sm cursor-pointer"
              style={{
                color: darkMode ? "#bbb" : "#777", // Icon and text color change for darkMode
              }}
            >
              <FontAwesomeIcon icon={faShare} className="mx-2" />
              {dish.share}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

Cards.propTypes = {
  dish: PropTypes.object.isRequired,
  darkMode: PropTypes.bool.isRequired, // Added prop type for darkMode
};

export default Cards;
