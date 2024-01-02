// eslint-disable-next-line no-unused-vars
import React from "react";
import upload from "../assets/Images/UploadImage.jpg";

const AddRecipe = () => {
  return (
    <div className="w-[80vw] m-auto my-12">
      <h1 className="text-3xl font-extrabold text-red-700 my-8 text-center">New Recipe</h1>
      <form>
        <div className="grid grid-cols-[50%_50%] space-x-4">
          <input
            type="image"
            src={upload}
            className="h-[60vh] border border-red-700 rounded-md w-full object-cover object-center"
          />
          <div className="relative">
            <label
              htmlFor="message"
              className="text-red-700 font-semibold text-lg text-center"
            >
              About the Recipe
            </label>

            <textarea
              id="message"
              name="message"
              className="w-full h-40 bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-200 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out my-2"
            ></textarea>
            <div className="flex justify-start items-center">
              <label
                htmlFor="message"
                className="text-red-700 font-semibold text-lg text-center mx-4"
              >
                Select Category:
              </label>
              <select
                id="countries"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-700 focus:border-red-700 block w-[40%] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-700 dark:focus:border-red-700"
              >
                <option selected>Choose a country</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="FR">France</option>
                <option value="DE">Germany</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[40%_60%] my-16">
          <div className="px-4 border-e border-gray-200">
            <label
              htmlFor="ingredient"
              className="text-red-700 font-semibold text-lg"
            >
              List Ingredients
            </label>
            <input
              type="text"
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out my-4"
            />
            <button className="inline-flex items-center bg-red-700 border-0 py-1 px-3 focus:outline-none hover:bg-red-500 rounded text-white mt-4 md:mt-0 transition-all">
              Add
            </button>
          </div>
          <div className="px-4">
            <label
              htmlFor="ingredient"
              className="text-red-700 font-semibold text-lg"
            >
              Steps
            </label>
            <input
              type="text"
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out my-4"
            />
            <button className="inline-flex items-center bg-red-700 border-0 py-1 px-3 focus:outline-none hover:bg-red-500 rounded text-white mt-4 md:mt-0 transition-all">
              Add Steps
            </button>
          </div>
        </div>
        <button className="inline-flex items-center bg-red-700 border-0 py-1 px-16 focus:outline-none hover:bg-red-500 rounded text-white mt-4 md:mt-0 transition-all">
              Publish
            </button>
      </form>
    </div>
  );
};

export default AddRecipe;
