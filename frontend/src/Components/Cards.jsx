// eslint-disable-next-line no-unused-vars
import React, { useRef, useState } from "react";
import PropTypes from "prop-types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faHeart, faShare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

//IMPORT THE APP.CSS
import "../App.css";
import axios from "axios";
import ShareComponent from "./ShareComponent";
// Cards Component for Creating Recipe Cards
const Cards = ({ dish, setRecipes, recipes, index }) => {
  const navigate = useNavigate()
  const shareButton = useRef(null)
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const recipeId = dish._id
  const [shareOption, setShareOption] = useState(false)
  const [url, setUrl] = useState('')
  // Checks if user is authenticated or not
  const handleClick = async () => {
    const token = await JSON.parse(localStorage.getItem("tastytoken"));
    if (token !== null) {
      // here passing logged in username as well for comment use
      navigate(`/recipe/${dish._id}`,
        { state: { dish } })
    } else {
      toast.info("Please Login First")
      navigate("/login")
    }
  }


  const handleShare = async (e) => {
    e.stopPropagation()
    try {
      const token = await JSON.parse(localStorage.getItem("tastytoken"));
      if (token == null) {
        toast.info("Please Login First")
        navigate("/login")
      }
      if (token !== null) {
        // console.log(token)
        const updateShareCount = await axios.patch(`${backendURL}/api/recipe/share/${recipeId}`, {}, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        if (updateShareCount.status === 200) {
          const postURL = window.location.origin + '/recipe/' + dish._id
          // console.log(window.location.origin)
          const updatedRecipes = [...recipes];
          // Update the share count for the specific index
          updatedRecipes[index] = {
            ...updatedRecipes[index], // Spread the existing recipe object
            share: updatedRecipes[index].share + 1  // Increase the share value
          };

          // Set the new recipes array with the updated value
          setRecipes(updatedRecipes);
          navigator.clipboard.writeText
            ((postURL));
          // toast.info("Link copied to clipboard")
          setUrl(postURL)
          // console.log(url)
          setShareOption(true)
        }
        else {
          toast.info(updateShareCount.message || "Something went wrong")
        }
      }
    } catch (error) {
      toast.info("Something went wrong")
    }
  }

  return (
    <div className="p-4 cursor-pointer" >
      {shareOption && <ShareComponent url={url} setShareOption={setShareOption} shareOption={shareOption} />}
      <div className="border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden" onClick={handleClick}>
        <img
          className="lg:h-48 md:h-36 w-full object-cover object-center"
          src={dish.image}
          alt={dish.name}
          loading="lazy"
        />
        <div className="p-6">
          <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">
            {dish.type.join(", ")}
          </h2>
          <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
            {dish.name}
          </h1>
          <p className="leading-relaxed mb-3 clamped-text">
            {dish.description.slice(0, 174)}
            {dish.description.length > 174 ? "..." : null}
          </p>
          <div className="flex items-center flex-wrap ">
            <span className="text-red-500 inline-flex items-center md:mb-2 lg:mb-0">Recipe <FontAwesomeIcon icon={faArrowRight} /></span>
            <span className="text-gray-400 mr-3 inline-flex items-center lg:ml-auto md:ml-0 ml-auto leading-none text-sm pr-3 py-1 border-r-2 border-gray-200 cursor-pointer">
              <FontAwesomeIcon icon={faHeart} className="mx-2 " />
              {dish.likes}
            </span>
            <span className="text-gray-400 inline-flex items-center leading-none text-sm cursor-pointer" onClick={handleShare} >
              <FontAwesomeIcon ref={shareButton} icon={faShare} className="mx-2" />
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
};

export default Cards;
