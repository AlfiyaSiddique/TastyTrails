// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faPenSquare, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import backendURL from "../../common/backendUrl";
import axios from "axios";

const Navbar = () => {
  const path = useLocation().pathname;
  const [user, setUser] = useState(null)
  useEffect(()=>{
    const token = JSON.parse(localStorage.getItem("tastytoken"));
   if(token){
     axios.post(`${backendURL}/api/token`, {token})
     .then((res)=>{
       if(res.data.success){
        setUser(()=>{return {...res.data.user}})
       }
     })
     .catch((err)=>{
      console.log(err)
     })
   }else{
    setUser(null)
   }
  }, [path])

  return (
    <nav>
      <header className="text-gray-600 body-font">
        <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
          <div className="flex title-font font-medium items-center text-red-700 mb-4 md:mb-0">
            <span className="ml-3 text-xl font-bold">
              <Link to={"/"} className="font-[Merriweather]">
                TastyTrails{" "}
              </Link>
            </span>
          </div>

          <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
            <Link
              to="/recipes"
              className="mr-5 hover:text-red-700 text-black font-semibold"
            >
              Recipes
            </Link>
            <Link
              to="/mainmeals"
              className="mr-5 hover:text-red-700 text-black font-semibold"
            >
              Main Meals
            </Link>
            <Link
              to="/smallbites"
              className="mr-5 hover:text-red-700 text-black font-semibold"
            >
              Small Bites
            </Link>
            <Link
              to="/healthy"
              className="mr-5 hover:text-red-700 text-black font-semibold"
            >
              Healthy
            </Link>
          </nav>
          {user === null ? (
            <Link to={path == "/" || path == "/signup" ? "/login" : "/signup"}>
              <button className="inline-flex items-center bg-red-700 border-0 py-1 px-3 focus:outline-none hover:bg-red-500 rounded text-white mt-4 md:mt-0 transition-all">
                {path === "/" || path == "/signup" ? "Login" : "Sign Up"}
                <FontAwesomeIcon icon={faArrowRight} className="mx-2" />
              </button>
            </Link>
          ) : (
            <div className="flex justify-center items-center">
              <Link to={`/user/${user._id}/profile`} className="mx-2">
                <FontAwesomeIcon icon={faUserCircle} className="mx-2 text-red-700 text-lg" />
                <span className="text-black font-semibold">Profile</span>
              </Link>
              <Link to={`/user/${user._id}/new/recipe`} className="mx-2">
                <FontAwesomeIcon icon={faPenSquare} className="mx-2 text-red-700 text-lg" />
                <span className="text-black font-semibold">Add Recipe</span>
              </Link>
            </div>
          )}
        </div>
      </header>
    </nav>
  );
};

export default Navbar;
