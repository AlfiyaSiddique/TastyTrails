
import { useState, useEffect } from "react";

import axios from "axios";
import Cards from "../Components/Cards.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import Pagination from "../Components/Pagination.jsx";
import RecipeCardSkeleton from "./RecipeSkeleton.jsx";

const Recipes = ({type}) => {
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [pagination, setPagination] = useState({
    totalRecipes: 5,
    currentPage: 1,
    totalPages: 1
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const limit = 10;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    // Cleanup the timeout if searchTerm changes before the delay
    return () => { clearTimeout(handler)};
  }, [searchTerm]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(`${backendURL}/api/recipes`, {
          params: {
            page: pagination.currentPage,
            limit,
            type,
            search: debouncedSearchTerm,
          },
        });

        const { recipes, pagination: paginationData } = response.data;     
          
        setRecipes(recipes);
     
        setPagination((prev) => ({
          ...prev,
          totalRecipes: paginationData.totalRecipes,
          totalPages: paginationData.totalPages
        }));
      } catch (err) {
        console.log(err);
      }finally{
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [pagination.currentPage, type, debouncedSearchTerm]); 

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleNextPage = () => {
    if (pagination.currentPage < pagination.totalPages) {
      setPagination((prev) => ({
        ...prev,
        currentPage: prev.currentPage + 1
      }));
    }
  };

  const handlePrevPage = () => {
    if (pagination.currentPage > 1) {
      setPagination((prev) => ({
        ...prev,
        currentPage: prev.currentPage - 1
      }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-6" id="Recipes"> {/* Adjusted layout */}
      <div className="relative w-[70%] mx-auto">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <FontAwesomeIcon
            icon={faSearch}
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
          />
        </div>
        <input
          type="search"
          id="default-search"
          className="block p-3 w-full ps-10 text-sm text-gray-900 border border-red-300 rounded-lg focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-red-500 outline-none"
          placeholder="Search Recipes with Name"
          required
          value={searchTerm}
          onChange={handleSearch}
        />
        <button
          type="submit"
          className="text-white absolute end-0 bottom-0 bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-4 py-[13px] rounded-r-md dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
        >
          Search
        </button>
      </div>
  
      {/* Recipes List or Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 pt-20 pb-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <RecipeCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="flex-grow my-20"> {/* Takes up remaining space */}
          {recipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {recipes.map((food) => (
                <Cards dish={food} key={food._id} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center text-center mt-10">
              <p className="text-3xl text-gray-400">No such Dish found.</p>
              <p className="text-md text-gray-400">
                If you know the Recipe, share it with the community.
              </p>
            </div>
          )}
        </div>
      )}
      {/* -------------------Use Pagination component-----------------------------*/}
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPrev={handlePrevPage}
        onNext={handleNextPage}
      />
    </div>
  );
};

Recipes.propTypes = {
  type: PropTypes.string.isRequired,
};

export default Recipes;
