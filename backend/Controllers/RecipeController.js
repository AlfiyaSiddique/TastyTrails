import Recipe from "../models/Recipe.js";
import Comment from "../models/Comment.js";
import axios from "axios";
import User from "../models/User.js";
import mongoose from "mongoose";

/**
 * @GET /api/recipes/random
 * @description Get a random recipe
 * @access public
 */
const getRandomRecipe = async (req, res) => {
  try {
    const count = await Recipe.countDocuments();
    if (count === 0) {
      return res.status(404).json({ success: false, message: "No recipes found" });
    }
    const random = Math.floor(Math.random() * count);
    const recipe = await Recipe.findOne().skip(random); // Get a random recipe
    return res.status(200).json({ success: true, recipe });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * @route {POST} /api/recipe/add
 * @description Add a REcipe to database
 * @access private
 */

const addRecipe = async (req, res) => {
  try {
    const {
      name,
      description,
      ingredients,
      steps,
      type,
      image,
      imagename,
      user,
      author,
    } = req.body;

    const lastDocument = await Recipe.findOne().sort({ _id: -1 });
    const unique = lastDocument
      ? lastDocument._id.toString().slice(-4)
      : "0000";

    
    const data = {
      user,
      name,
      description,
      ingredients,
      steps,
      image,
      imagename, 
      author,
      type,
    };

    const newRecipe = new Recipe(data);
    const saved = await newRecipe.save();

    return res
      .status(200)
      .json({ success: true, message: "Recipe Published Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * @route {POST} /api/recipes
 * @description Returns all recipes in result
 * @access public
 */
const allRecipe = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const type = req.query.type ? req.query.type.split(",") : [];

    const skip = (page - 1) * limit;

    let searchQuery = {};

    if (search) {
      searchQuery = {
        ...searchQuery,
        $or: [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      };
    }

    if (type.length) {
      searchQuery = {
        ...searchQuery,
        type: { $in: type },
      };
    }

    const totalRecipes = await Recipe.countDocuments(searchQuery);

    const recipes = await Recipe.find(searchQuery).skip(skip).limit(limit);

    return res.status(200).json({
      success: true,
      recipes,
      pagination: {
        totalRecipes,
        currentPage: page,
        totalPages: Math.ceil(totalRecipes / limit),
        limit,
      },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};



/**
 * @POST /api/recipes/readall
 * @description Returns recipe created by an User
 * @access private
 */
const getOneUserRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ user: req.body.id });
    return res.status(200).json({ success: true, recipes });
  } catch (error) {
    console.log(error);
    res.status(404).json({ success: false, message: "Internal server error" });
  }
};

/**
 * @POST /api/recipes/update
 * @description Updates a Recipe
 * @access private
 */
const updateRecipe = async (req, res) => {
  try {
    const { name, description, ingredients, steps, type, user, author, id, imagename, image } =
      req.body;
    const data = {
      user,
      name,
      description,
      ingredients,
      steps,
      author,
      type,
      image,
      imagename
    };
    const update = await Recipe.updateOne(
      { _id: id },
      { $set: data },
      { new: true }
    );
    return res
      .status(200)
      .json({ success: true, message: "Recipe Updates Successfully" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ success: false, message: "Internal server error" });
  }
};

/**
 * @POST /api/recipes/delete
 * @description Deletes a Recipe
 * @access private
 */
const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.body.id);

    if (!recipe) {
      return res
        .status(404)
        .json({ success: false, message: "Recipe not found" });
    }




    // If successful, delete the recipe from the database
    await Recipe.deleteOne({ _id: req.body.id });

    return res
      .status(200)
      .json({ success: true, message: "Recipe Deleted Successfully" });
  } catch (error) {
    console.error(
      "Error deleting recipie:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// Added fucntions for adding and fetching comments

/**
 * @POST /api/recipe/addcomment
 * @description Add a comment to a recipe
 * @access private
 */
const addComment = async (req, res) => {
  try {
    const { recipeId, content, username } = req.body;
    const userId = req.user.userId; // Get the user's ID from the authenticated request

    // Ensure the recipe exists
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ success: false, message: "Recipe not found" });
    }

    // Create a new comment
    const newComment = new Comment({
      recipe: recipeId,
      user: userId, 
      username,
      content,
    });

    // Save the comment to the database
    await newComment.save();

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment: newComment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * @GET /api/recipe/getcomments/:recipeId
 * @description Get all comments for a specific recipe
 * @access public
 */
const getComments = async (req, res) => {
  try {
    const { recipeId } = req.params;

    // Ensure the recipe exists
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res
        .status(404)
        .json({ success: false, message: "Recipe not found" });
    }

    // Fetch all comments for this recipe
    const recipeObjectId = new mongoose.Types.ObjectId(recipeId);
    const comments = await Comment.find({ recipe: recipeObjectId })
      .select("username content date")
      .sort({ date: -1 });
    return res.status(200).json({ success: true, comments });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const addRecipeLike = async (req, res) => {
  try {
    const { recipeId, userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // If the user hasn't already liked the recipe, add the like
    if (!user.likedRecipes.includes(recipeId)) {
      user.likedRecipes.push(recipeId);
      recipe.likes += 1; // Increment the like count
      await user.save();
      await recipe.save();
    }

    res.status(200).json({
      success: true,
      message: "Recipe liked",
      totalLikes: recipe.likes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const removeRecipeLike = async (req, res) => {
  try {
    const { recipeId, userId } = req.body;

    // Find the user by their ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the recipe by its ID
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // If the user has liked the recipe, remove the like
    if (user.likedRecipes.includes(recipeId)) {
      // Remove the recipeId from the likedRecipes array
      user.likedRecipes = user.likedRecipes.filter(
        (id) => id.toString() !== recipeId.toString()
      );

      // Decrement the like count
      recipe.likes = Math.max(recipe.likes - 1, 0); // Ensure likes don't go negative

      // Save both the user and the recipe
      await user.save();
      await recipe.save();

      return res.status(200).json({
        success: true,
        message: "Recipe unliked",
        totalLikes: recipe.likes,
      });
    } else {
      return res
        .status(400)
        .json({ message: "Recipe is not liked by the user" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const getLikedRecipe = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const likedRecipeIds = user.likedRecipes;
    const likedRecipes = await Recipe.find({
      _id: { $in: likedRecipeIds },
    });
    return res.status(200).json({ success: true, likedRecipes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteComment = async (req, res) => {
  try {
    // Extract comment ID from the request parameters
    const { commentId } = req.params;
    const userId = req.user.userId; // Get the user's ID from the authenticated request

    // Find the comment by ID
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if the comment was created by the user
    if (!comment.user.equals(userId)) {
      return res.status(403).json({ message: "You do not have permission to delete this comment" });
    }

    // Delete the comment
    await Comment.findByIdAndDelete(commentId);

    // Return success response
    res.status(200).json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({
      message: "An error occurred while deleting the comment",
      error: error.message,
    });
  }
};


/**
 * @PATCH /api/recipe/share/:recipeId
 * @description update the number of share of recipe id
 * @access private
 */
//This function will update share count of any recipe

const updateShareCount = async (req, res) => {
  const { recipeId } = req.params;
  if (!recipeId) {
    return res.status(400).json({ success: false, message: "Invalid request" });
  }

  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe)
      return res
        .status(404)
        .json({ success: false, message: "Recipe Not found!!" });
    const shareCount = recipe.share;
    const updateStatus = await Recipe.findByIdAndUpdate(
      recipeId,
      {
        $set: {
          share: shareCount + 1,
        },
      },
      {
        new: true,
      }
    );
    if (!updateStatus)
      return res
        .status(500)
        .json({ success: false, message: "Internal Server error" });
    return res.status(200).json({ success: true, updateStatus });
  } catch (error) {
    // console.log(error)
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//Function to get individual recipe by ID. This will be needed when we share our recipe so in order to ensure that link works we need to make function that will fetch individual recipe by id
/**
 * @PATCH /api/recipe/:recipeId
 * @description get individual recipe by id
 * @access public
 */
const getRecipeById = async (req, res) => {
  try {
    const { recipeId } = req.params;
    if (!recipeId) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid request" });
    }
    const recipeIdObejctId = new mongoose.Types.ObjectId(recipeId);
    if (!recipeIdObejctId) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid request" });
    }
    const recipe = await Recipe.findById(recipeIdObejctId);
    if (!recipe) {
      return res
        .status(400)
        .json({ success: false, message: "Recipe Not Found" });
    }
    return res.status(200).json({ success: true, dish: recipe });
  } catch (error) {
    // console.log(error)
    return res
      .status(500)
      .json({ success: false, message: "Internal Server error" });
  }
};

const RecipeController = {
  addRecipe,
  allRecipe,
  getOneUserRecipes,
  updateRecipe,
  deleteRecipe,
  addComment,
  getComments,
  addRecipeLike,
  removeRecipeLike,
  getLikedRecipe,
  updateShareCount,
  getRecipeById,
  deleteComment,
};

export default {
  RecipeController,
  getRandomRecipe,
};