// eslint-disable-next-line no-unused-vars
import React from "react";
import { useLocation } from "react-router-dom";

// Displays single Recipe
const OneRecipe = ({ darkMode }) => {
  const recipe = useLocation().state.dish;
  const date = new Date(recipe.date);

  return (
    <div className={`w-[80vw] m-auto my-12 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <h1 className={`text-3xl font-extrabold my-8 text-center ${darkMode ? 'text-red-400' : 'text-red-700'}`}>{recipe.name}</h1>
      <form>
        <div className="md:grid md:grid-cols-[50%_50%] space-x-4">
          <input
            type="image"
            src={recipe.image}
            className="h-[60vh] border border-red-700 rounded-md w-full object-cover object-center"
          />
          <div className="relative">
            <h2 className={`font-semibold text-lg text-center ${darkMode ? 'text-red-400' : 'text-red-700'}`}>
              About the Dish
            </h2>
            <div
              className={`w-full h-40 rounded border border-gray-300 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out my-2 ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-red-100 bg-opacity-50 text-gray-700'}`}
            >
              {recipe.description}
            </div>
            <div className="flex md:justify-start md:items-center flex-col items-start">
              <div className={`font-bold text-md text-center mx-4 ${darkMode ? 'text-gray-300' : ''}`}>
                <span className={darkMode ? 'text-red-400' : 'text-red-700'}>Category:</span> {recipe.type.join(", ")}
              </div>
              <div className={`flex md:justify-between text-md font-bold text-center mx-4 ${darkMode ? 'text-gray-300' : ''}`}>
                <span className={darkMode ? 'text-red-400 mx-2' : 'text-red-700 mx-2'}>Date:</span>{`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`}
              </div>
            </div>
            {recipe.author && (
              <span className={`mx-4 text-md font-bold ${darkMode ? 'text-gray-300' : ''}`}>
                <span className={darkMode ? 'text-red-400' : 'text-red-700'}>Author:</span>{recipe.author}
              </span>
            )}
          </div>
        </div>

        <div className="md:grid md:grid-cols-[40%_60%] my-16 ">
          <div className="px-4 border-e border-gray-200">
            <div className={`font-semibold text-lg ${darkMode ? 'text-red-400' : 'text-red-700'}`}>
              List of Ingredients
            </div>
            <ul className="list-disc list-inside">
              {recipe.ingredients.map((item, index) => {
                return <li className="py-1" key={index}>{item}</li>;
              })}
            </ul>
          </div>
          <div className="px-4 mt-5 md:mt-0">
            <div className={`font-semibold text-lg ${darkMode ? 'text-red-400' : 'text-red-700'}`}>
              Steps
            </div>
            <ol className="list-inside list-decimal">
              {recipe.steps.map((item, index) => {
                return <li className="py-1" key={index}>{item}</li>;
              })}
            </ol>
          </div>
        </div>
      </form>
    </div>
  );
};

export default OneRecipe;
