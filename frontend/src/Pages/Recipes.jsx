import { useState, useEffect } from "react";
import axios from "axios";
import Cards from "../Components/Cards.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import Pagination from "../Components/Pagination.jsx";

const Recipes = ({ type, darkMode }) => {
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [pagination, setPagination] = useState({
    totalRecipes: 5,
    currentPage: 1,
    totalPages: 1
  });
  const [searchTerm, setSearchTerm] = useState("");
  const limit = 10;

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(`${backendURL}/api/recipes`, {
          params: {
            page: pagination.currentPage,
            limit,
            type,
            search: searchTerm,
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
    <div className={`p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`} id="Recipes">
      <div className="relative w-[70%] mx-auto">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <FontAwesomeIcon
            icon={faSearch}
            className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
          />
        </div>
        <input
          type="search"
          id="default-search"
          className={`block p-3 w-full ps-10 text-sm border border-red-300 rounded-lg focus:ring-red-500 focus:border-red-500 ${
            darkMode ? 'bg-gray-700 border-gray-600 placeholder-gray-400 text-white' : 'bg-gray-50'
          }`}
          placeholder="Search Recipes with Name"
          required
          value={searchTerm}
          onChange={handleSearch}
        />
        <button
          type="submit"
          className={`text-white absolute end-0 bottom-0 bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-4 py-[13px] rounded-r-md ${darkMode ? 'bg-red-600 hover:bg-red-700' : ''}`}
        >
          Search
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 pt-20 pb-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[230px] sm:h-[280px] bg-gray-200 animate-pulse rounded-sm" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 my-20">
          {recipes.map((food) => (
            <Cards dish={food} key={food._id} darkMode={darkMode} />
          ))}
        </div>
      )}

      {recipes.length === 0 && !loading && (
        <div className="flex flex-col justify-center items-center">
          <p className={`text-3xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No such Dish found.</p>
          <p className={`text-md ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            If you know the Recipe, share it with the community.
          </p>
        </div>
      )}

      {/* -------------------Use Pagination component----------------------------- */}
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPrev={handlePrevPage}
        onNext={handleNextPage}
        darkMode={darkMode}
      />
    </div>
  );
};

Recipes.propTypes = {
  type: PropTypes.string.isRequired,
  darkMode: PropTypes.bool.isRequired,
};

export default Recipes;
