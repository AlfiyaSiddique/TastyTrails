import mongoose from "mongoose";
import Recipe from "./models/Recipe.js";
import dotenv from "dotenv"; // Add this line

dotenv.config();

const dummyRecipes = [
  {
    user: null,
    name: "Spaghetti Bolognese",
    description: "A classic Italian pasta dish with a rich, savory sauce.",
    ingredients: [
      "spaghetti",
      "ground beef",
      "onion",
      "garlic",
      "tomato sauce",
      "salt",
      "pepper",
      "parmesan cheese",
    ],
    steps: [
      "Cook the spaghetti according to package instructions.",
      "In a separate pan, sauté onions and garlic until fragrant.",
      "Add ground beef and cook until browned.",
      "Stir in tomato sauce and simmer for 20 minutes.",
      "Serve over spaghetti and top with parmesan cheese.",
    ],
    author: "Chef John",
    image: "https://example.com/spaghetti-bolognese.jpg",
    likes: 0,
    share: 0,
    type: ["Italian", "Pasta"],
  },
  {
    user: null,
    name: "Chicken Curry",
    description: "A flavorful curry dish made with tender chicken pieces.",
    ingredients: [
      "chicken",
      "curry powder",
      "coconut milk",
      "onion",
      "garlic",
      "ginger",
      "rice",
    ],
    steps: [
      "Sauté onions, garlic, and ginger in a pan.",
      "Add chicken pieces and cook until browned.",
      "Stir in curry powder and coconut milk, then simmer until chicken is cooked through.",
      "Serve with rice.",
    ],
    author: "Chef Sarah",
    image: "https://example.com/chicken-curry.jpg",
    likes: 0,
    share: 0,
    type: ["Indian", "Curry"],
  },
  {
    user: null,
    name: "Vegetable Stir Fry",
    description: "A quick and healthy vegetable stir fry.",
    ingredients: [
      "mixed vegetables",
      "soy sauce",
      "ginger",
      "garlic",
      "olive oil",
      "sesame seeds",
    ],
    steps: [
      "Heat olive oil in a pan.",
      "Add garlic and ginger, sauté until fragrant.",
      "Add mixed vegetables and stir fry for a few minutes.",
      "Drizzle with soy sauce and sprinkle with sesame seeds before serving.",
    ],
    author: "Chef Emma",
    image: "https://example.com/vegetable-stir-fry.jpg",
    likes: 0,
    share: 0,
    type: ["Vegetarian", "Quick"],
  },
];

const seedDB = async () => {
  try {
    // Connect to the MongoDB database
    await mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Clear existing recipes
    await Recipe.deleteMany({});

    // Insert dummy recipes
    await Recipe.insertMany(dummyRecipes);
    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();
