import mongoose from "mongoose";

// Recipe Model
const recipeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  ingredients: {
    type: [String],
    required: true,
  },
  steps: {
    type: [String],
    required: true,
  },
  author: {
    type: String,
    default: null,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  image: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  share: {
    type: Number,
    default: 0,
  },
  type: {
    type: [String],
  required: true}
});

const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;
