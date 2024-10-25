// src/components/RecipeOfTheDay.jsx
import React, { useEffect, useState } from 'react';

function RecipeOfTheDay() {
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    // Fetch a random recipe from the API
    fetch('/api/recipes/random')
      .then((response) => response.json())
      .then((data) => setRecipe(data))
      .catch((error) => console.error('Error fetching recipe:', error));
  }, []);

  if (!recipe) return <p>Loading Recipe of the Day...</p>;

  return (
    <section className="recipe-of-the-day p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Recipe of the Day</h2>
      <div className="recipe-info">
        <h3 className="text-xl font-semibold">{recipe.title}</h3>
        <p>{recipe.description}</p>
        <img
          data-src={recipe.image}
          alt={recipe.title}
          className="lazyload w-full h-48 object-cover rounded-lg mt-4"
        />
      </div>
    </section>
  );
}

export default RecipeOfTheDay;
