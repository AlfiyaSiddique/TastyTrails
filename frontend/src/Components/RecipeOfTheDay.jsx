import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cards from './Cards'; // Import the Cards component to display the recipe

const RecipeOfTheDay = () => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchRecipeOfTheDay = async () => {
      try {
        const response = await axios.get(`${backendURL}/api/recipes/random`);
        setRecipe(response.data.recipe); // Assuming the API returns a recipe object
      } catch (error) {
        console.error('Error fetching recipe of the day:', error);
        setError('Failed to fetch recipe. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeOfTheDay();
  }, []); // No dependencies needed

  return (
    <section id="RecipeOfTheDay" className="py-4 my-20 mx-8">
      <h1 className="text-center font-semibold text-4xl text-red-700 my-4 font-[Merriweather]">
        Recipe For The Day
      </h1>
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-red-700"></div>
        </div>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <Cards dish={recipe} />
      )}
    </section>
  );
};

export default RecipeOfTheDay;