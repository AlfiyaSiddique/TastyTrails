import React, { useState } from "react";

const backendURL = import.meta.env.VITE_BACKEND_URL;

const RecipeSuggestions = () => {
  const [ingredients, setIngredients] = useState("");
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setIngredients(e.target.value);
  };

  const getRecipeSuggestions = async () => {
    setLoading(true);
    try {
      // Call the OpenAI GPT API with the ingredients
      const response = await fetch(`${backendURL}/api/get-recipe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ingredients }),
      });
      const data = await response.json();
      setRecipe(data.recipe);
    } catch (error) {
      console.error("Error fetching recipe:", error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        AI-powered Recipe Suggestions
      </h1>

      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
        <input
          type="text"
          placeholder="Enter ingredients (comma separated)"
          value={ingredients}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-red-600"
        />

        <button
          onClick={getRecipeSuggestions}
          disabled={loading}
          className={`w-full py-3 px-4 text-white font-semibold rounded-lg ${
            loading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {loading ? "Generating Recipe..." : "Get Recipe"}
        </button>
      </div>

      {recipe && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-lg w-full max-w-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Suggested Recipe:
          </h2>
          <p className="text-gray-600 whitespace-pre-wrap">{recipe}</p>
        </div>
      )}
    </div>
  );
};

export default RecipeSuggestions;
