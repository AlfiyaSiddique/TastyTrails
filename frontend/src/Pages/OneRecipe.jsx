// eslint-disable-next-line no-unused-vars
import React from "react";
import { useLocation } from "react-router-dom";

// Displays single Recipe
const OneRecipe = () => {
    const recipe = useLocation().state.dish;
    const date = new Date(recipe.date)

  return (
    <div className="w-[80vw] m-auto  my-12">
      <h1 className="text-3xl font-extrabold text-red-700 my-8 text-center">{recipe.name}</h1>
      <form>
        <div className="md:grid md:grid-cols-[50%_50%] space-x-4">
          <input
            type="image"
            src={recipe.image}
            className="h-[60vh] border border-red-700 rounded-md 
         w-full object-cover object-center"
          />
          <div className="relative">
            <h2
              className="text-red-700 font-semibold text-lg text-center"
            >
              About the Dish
            </h2>
            <div
              className="w-full h-40 bg-red-100 bg-opacity-50 rounded border border-gray-300 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-200 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out my-2"
            >{recipe.description}</div>
            <div className="flex md:justify-start md:items-center flex-col items-start">
              <div
                className="font-bold text-md text-center mx-4"
              >
                <span className="text-red-700 ">Category:</span> {recipe.type.join(", ")}
              </div>
              <div
                className="flex md:justify-between text-md font-bold text-center mx-4"
              >
              <span className="text-red-700 mx-2">Date:</span>{`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`}
              </div>
            </div>
            {recipe.author && <span className=" mx-4 text-md font-bold"><span className="text-red-700">Author:</span>{recipe.author}</span>}
          </div>
        </div>

        <div className="md:grid md:grid-cols-[40%_60%] my-16 ">
          <div className="px-4 border-e border-gray-200">
            <div
              className="text-red-700 font-semibold text-lg"
            >
              List of Ingredients
            </div>
             <ul className="list-disc list-inside">

                {recipe.ingredients.map((item, index)=>{
                  return <li className="py-1" key={index}>{item}</li>
                })}
             </ul>
          </div>
          <div className="px-4 mt-5 md:mt-0">
            <div
              className="text-red-700 font-semibold text-lg"
            >
              Steps
            </div>
            <ol className="list-inside list-decimal">
                {recipe.steps.map((item, index)=>{
                  return <li className="py-1" key={index}>{item}</li>
                })}
             </ol>
          </div>
        </div>
      </form>
    </div>
  );
};

export default OneRecipe;
