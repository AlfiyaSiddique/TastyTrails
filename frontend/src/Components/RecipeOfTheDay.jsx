import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RecipeOfTheDay = () => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchRecipeOfTheDay = async () => {
      try {
        const response = await axios.get(`${backendURL}/api/recipe-of-the-day`);
        if (response.data.success) {
          setRecipe(response.data.recipe);
        } else {
          console.error('Failed to fetch recipe:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching Recipe of the Day:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeOfTheDay();
  }, [backendURL]);

  if (loading) {
    return <div className="text-center">Loading Recipe of the Day...</div>;
  }

  if (!recipe) {
    return <div className="text-center">No Recipe of the Day available.</div>;
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <img 
        src={recipe.image} 
        alt={recipe.name} 
        className="w-full h-64 object-cover"
      />
      <div className="p-6">
        <h2 className="text-2xl font-bold text-red-700 mb-2">{recipe.name}</h2>
        <p className="text-gray-600 mb-4">{recipe.description}</p>
        <button 
          onClick={() => navigate(`/recipe/${recipe._id}`, { state: { dish: recipe } })}
          className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        >
          View Recipe
        </button>
      </div>
    </div>
  );
};

export default RecipeOfTheDay;