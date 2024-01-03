// eslint-disable-next-line no-unused-vars
import React, {useState, useEffect} from "react";
import backendURL from "../../common/backendUrl";
import axios from "axios";
import Cards from "../Components/Cards";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types"

const Recipes = ({type}) => {

  const [recipe, setRecipe] = useState([])
  const [filter, setFilter] = useState([])

  // Gets all recipes
  useEffect(()=>{
    axios.get(`${backendURL}/api/recipes`)
    .then((res)=>{
      let data =res.data.recipes 
     if(type !== ""){
       data = data.filter((food)=>{
        return food.type.includes(type)
       })
     }
        setRecipe(data)
        setFilter(data)
    }).catch((err)=>{
      console.log(err)
    })
  }, [])

  // Filter Recipe based on search term
  const handleSearch = (e)=>{

    if(e.target.value === "") setFilter(recipe)

    const filterRecipe = recipe.filter((dish)=>{
        return dish.name.toLowerCase().includes(e.target.value.toLowerCase())
    })
    setFilter(()=>filterRecipe)
  }

  return (
    <div className="p-6" id="Recipes">
        <div className="relative w-[70%] mx-auto">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <FontAwesomeIcon icon={faSearch}   className="w-4 h-4 text-gray-500 dark:text-gray-400"/>
          </div>
          <input
            type="search"
            id="default-search"
            className="block p-3 w-full ps-10 text-sm text-gray-900 border border-red-300 rounded-lg focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-red-500 outline-none"
            placeholder="Search Recipes with Name"
            required
            onChange={handleSearch}
          />
            <button type="submit" className="text-white absolute end-0 bottom-0 bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium  text-sm px-4 py-[13px] rounded-r-md dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Search</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 my-20">
        {filter.map((food)=>{
          return <Cards dish={food} key={food._id}/>
        })}

        </div>
        {filter.length === 0 && recipe.length > 0 &&
        <div className="flex flex-col justify-center items-center">
         <p className="text-3xl text-gray-400">No such Dish found.</p>
         <p className="text-md text-gray-400"> If you know the Recipe Share it with the community.</p>
        </div>}
    </div>
  );
};

Recipes.propTypes = {
  type: PropTypes.string.isRequired
}

export default Recipes;
