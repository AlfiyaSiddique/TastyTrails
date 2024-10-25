// backend/routes/recipes.js
const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');

// Endpoint to fetch a random recipe
router.get('/random', async (req, res) => {
  try {
    const count = await Recipe.countDocuments();
    const randomIndex = Math.floor(Math.random() * count);
    const randomRecipe = await Recipe.findOne().skip(randomIndex);
    res.json(randomRecipe);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching random recipe' });
  }
});

module.exports = router;
