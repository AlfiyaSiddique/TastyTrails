// eslint-disable-next-line no-unused-vars
import React from "react";
import PropTypes from  "prop-types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faHeart, faShare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

//IMPORT THE APP.CSS
import "../App.css";
// Cards Component for Creating Recipe Cards
const Cards = ({dish}) => {
  const navigator = useNavigate()

  // Checks if user is authenticated or not
  const handleClick = async()=>{
    const token = await JSON.parse(localStorage.getItem("tastytoken"));
    if(token !== null){
      // here passing logged in username as well for comment use
      navigator(`/recipe/${dish._id}`, 
        {state: {dish}})
    }else{
      toast.info("Please Login First")
      navigator("/login")
    }
  }
  return (
    <div className="p-4 cursor-pointer" onClick={handleClick}>
      <div className="border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
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
            {dish.description.length>174? "...": null}
          </p>
          <div className="flex items-center flex-wrap ">
              <span className="text-red-500 inline-flex items-center md:mb-2 lg:mb-0">Recipe <FontAwesomeIcon icon={faArrowRight} /></span>
            <span className="text-gray-400 mr-3 inline-flex items-center lg:ml-auto md:ml-0 ml-auto leading-none text-sm pr-3 py-1 border-r-2 border-gray-200 cursor-pointer">
              <FontAwesomeIcon icon={faHeart} className="mx-2 "/>
              {dish.likes}
            </span>
            <span className="text-gray-400 inline-flex items-center leading-none text-sm cursor-pointer">
              <FontAwesomeIcon icon={faShare} className="mx-2 "/>
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
