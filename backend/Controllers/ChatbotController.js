import axios from "axios"; // Using axios to make HTTP requests

const getRecipeSuggestions = async (req, res) => {
  const { ingredients } = req.body;

  try {
    // Make a POST request to Hugging Face's inference API
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/openai-community/gpt2", // You can replace 'gpt2' with a more suitable model if needed
      {
        inputs: `Suggest a food recipe using these ingredients: ${ingredients}.`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`, // Replace with your Hugging Face API key
          "Content-Type": "application/json",
        },
      }
    );

    const recipe = response.data[0].generated_text;
    res.json({ recipe });
  } catch (error) {
    console.error(error.response?.data);
    res.status(500).send("Error generating recipe");
  }
};

export default { getRecipeSuggestions };
