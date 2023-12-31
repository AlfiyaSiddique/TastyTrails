// eslint-disable-next-line no-unused-vars
import React from "react";

const Recipes = () => {
  return (
    <div className="p-6" id="Recipes">
        <div className="relative w-[70%] mx-auto">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block p-3 w-full ps-10 text-sm text-gray-900 border border-red-300 rounded-lg focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-red-500 outline-none"
            placeholder="Search Recipes with Name, Ingredients and types"
            required
          />
            <button type="submit" className="text-white absolute end-0 bottom-0 bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium  text-sm px-4 py-[13px] rounded-r-md dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Search</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3"></div>
    </div>
  );
};

export default Recipes;
