import { useState, useEffect } from "react";
import axios from "axios";
import Cards from "../Components/Cards.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import Pagination from "../Components/Pagination";
import emptyStateImage1 from "/assets/errorimg1.svg";
import emptyStateImage2 from "/assets/errorimg2.svg";
import emptyStateImage3 from "/assets/errorimg3.svg";
import emptyStateImage4 from "/assets/errorimg4.svg";


const Recipes = ({ type }) => {
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(false);
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [pagination, setPagination] = useState({
    totalRecipes: 5,
    currentPage: 1,
    totalPages: 1,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const limit = 10;

  let coverImage;

  switch (type) {
    case "":
      coverImage = emptyStateImage1;
      break;
    case "Main-meal":
      coverImage = emptyStateImage2;
      break;
    case "Small-bite":
      coverImage = emptyStateImage3;
      break;
    default:
      coverImage = emptyStateImage4;
      break;
  }

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setError(false);
        const response = await axios.get(`${backendURL}/api/recipes`, {
          params: {
            page: pagination.currentPage,
            limit,
            type,
            search: searchTerm,
          },
        });

        const { recipes, pagination: pagination } = response.data;
        setRecipes(recipes);
        setPagination((prev) => ({
          ...prev,
          totalRecipes: pagination.totalRecipes,
          totalPages: pagination.totalPages,
        }));
      } catch (err) {
        console.log(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [pagination.currentPage, type, searchTerm]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleNextPage = () => {
    if (pagination.currentPage < pagination.totalPages) {
      setPagination((prev) => ({
        ...prev,
        currentPage: prev.currentPage + 1,
      }));
    }
  };

  const handlePrevPage = () => {
    if (pagination.currentPage > 1) {
      setPagination((prev) => ({
        ...prev,
        currentPage: prev.currentPage - 1,
      }));
    }
  };

  return (
    <div className="p-6" id="Recipes">
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

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 pt-20 pb-4">
          {Array.from({ length: 6 }).map((item, i) => {
            return (
              <div
                key={i}
                className="h-[230px] sm:h-[280px] bg-gray-200 animate-pulse rounded-sm"
              />
            );
          })}
        </div>
      )}

      {/* Display Data */}
      {!loading && !error && recipes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 my-20">
          {recipes.map((food) => (
            <Cards dish={food} key={food._id} />
          ))}
        </div>
      )}

      {/* Empty Data or Error Handling */}
      {!loading && (recipes.length === 0 || error) && (
        <div className="flex flex-col justify-center items-center my-10">
          <img src={coverImage} alt="No data" className="w-[300px] mb-6" />
          {error ? (
            <p className="text-2xl text-red-500">
              Oops! Something went wrong, we are fixing it.
            </p>
          ) : (
            <>
              <p className="text-3xl text-gray-400">No such Dish found.</p>
              <p className="text-md text-gray-400">
                If you know the Recipe, share it with the community.
              </p>
            </>
          )}
        </div>
      )}

      {/* Pagination */}
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
