import Recipe from "../models/Recipe.js"
import Comment from "../models/Comment.js"
import axios from "axios"
import User from "../models/User.js"
import mongoose from "mongoose"
import { Octokit } from '@octokit/rest';
import { json } from "express"

const g_owner = process.env.OWNER;
const g_repo = process.env.REPO;
const g_branch = process.env.BRANCH;
const g_email = process.env.GITHUB_EMAIL;


/**
 * @route {POST} /api/recipe/add
 * @description Add a REcipe to database
 * @access private
 */

const addRecipe = async (req, res) => {
  try {
    const { name, description, ingredients, steps, type, image, imagename, user, author } = req.body;

    const lastDocument = await Recipe.findOne().sort({ _id: -1 });
    const unique = lastDocument ? lastDocument._id.toString().slice(-4) : "0000";

    // Upload the image to GitHub
    const imageUrl = await imageToGithub(image, imagename, unique);

    // If image upload fails, return an error
    if (!imageUrl) {
      return res.status(422).json({ success: false, message: "Image upload failed" });
    }

    // Prepare the recipe data
    const data = {
      user,
      name,
      description,
      ingredients,
      steps,
      image: imageUrl,  // Save the URL of the uploaded image
      author,
      type,
    };

    const newRecipe = new Recipe(data);
    const saved = await newRecipe.save();

    return res.status(200).json({ success: true, message: "Recipe Published Successfully" });
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
    const search = req.query.search || '';
    const type = req.query.type ? req.query.type.split(',') : [];

    const skip = (page - 1) * limit;

    let searchQuery = {};

    if (search) {
      searchQuery = {
        ...searchQuery,
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      };
    }

    if (type.length) {
      searchQuery = {
        ...searchQuery,
        type: { $in: type }
      };
    }

    const totalRecipes = await Recipe.countDocuments(searchQuery);

    const recipes = await Recipe.find(searchQuery)
      .skip(skip)
      .limit(limit);


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
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * @function
 * @description Uploads Image to a github repo and returns the downloadable link
 * @access private
 */


const imageToGithub = async (fileImage, name, unique) => {
  const owner = process.env.OWNER;
  const repo = process.env.REPO;
  const branch = process.env.BRANCH;

  // Validate environment variables
  if (!owner || !repo || !branch || !process.env.TOKEN) {
    console.error('Missing required environment variables');
    return null;
  }

  console.log('Config:', { owner, repo, branch }); // Debug log
  const base64Content = fileImage.split(';base64,').pop();
  const fileContent = Buffer.from(base64Content, 'base64').toString('base64');

  // Use the correct repository structure
  const path = `images/${unique}${name}`; // Make sure this directory exists in your repo
  const message = `Add ${unique} ${name} via API`;
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  console.log('Request URL:', url); // Debug log

  try {
    // Correct GitHub token format
    const headers = {
      Authorization: `token ${process.env.TOKEN}`, // Changed from Bearer to token
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    };

    // Check if file exists
    let fileExists = false;
    try {
      const response = await axios.get(url, { headers });
      fileExists = response.status === 200;
      console.log('File exists check:', fileExists); // Debug log
    } catch (error) {
      if (error.response && error.response.status !== 404) {
        console.error('Error checking file existence:', error.response.data);
        throw error;
      }
    }

    // Prepare request payload
    const requestPayload = {
      message,
      content: fileContent,
      branch,
    };

    if (fileExists) {
      const existingFile = await axios.get(url, { headers });
      requestPayload.sha = existingFile.data.sha;
    }

    // Upload or update file
    console.log('Sending PUT request...'); // Debug log
    const response = await axios.put(url, requestPayload, { headers });

    if (response.status === 201 || response.status === 200) {
      console.log('Upload successful:', response.data.content.download_url);
      return response.data.content.download_url;
    } else {
      console.error('Upload failed:', response.status, response.statusText);
      return null;
    }

  } catch (error) {
    console.error('Upload error details:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return null;
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
    return res.status(200).json({ success: true, recipes })
  } catch (error) {
    console.log(error);
    res.status(404).json({ success: false, message: "Internal server error" });
  }
}


/**
 * @POST /api/recipes/update
 * @description Updates a Recipe
 * @access private
 */
const updateRecipe = async (req, res) => {
  try {
    const { name, description, ingredients, steps, type, user, author, id } = req.body
    const data = {
      user,
      name,
      description,
      ingredients,
      steps,
      author,
      type
    }
    const update = await Recipe.updateOne({ _id: id }, { $set: data }, { new: true })
    return res.status(200).json({ success: true, message: "Recipe Updates Successfully" })
  } catch (error) {
    console.log(error);
    res.status(404).json({ success: false, message: "Internal server error" });
  }
}

/**
 * @POST /api/recipes/delete
 * @description Deletes a Recipe
 * @access private
 */
const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.body.id);

    if (!recipe) {
      return res.status(404).json({ success: false, message: "Recipe not found" });
    }

    const imageName = recipe.image;
    const owner = g_owner;
    const repo = g_repo;
    const branch = g_branch;
    const result = trimUrl(imageName, owner, repo);

    const octokit = new Octokit({
      auth: process.env.TOKEN
    });

    function trimUrl(url, owner, repo) {
      // To remove the unncessary part from the URL
      const parsedUrl = new URL(url);
      const trimmedPath = decodeURIComponent(parsedUrl.pathname.slice(1)); // Decode the URL and remove leading '/'
      const partToRemove = `${owner}/${repo}/${branch}/`;
      const finalPath = trimmedPath.replace(partToRemove, '');

      return finalPath;
    }

    // The function to fetch the file content
    const fetchFileContent = async () => {
      try {
        // Make the request to the GitHub API
        const response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
          owner: owner,
          repo: repo,
          path: result,
          headers: {
            'X-GitHub-Api-Version': '2022-11-28'
          }
        });
        // Getting the SHA key so that it can assist in deletion
        const sha = response.data.sha;
        await octokit.request('DELETE /repos/{owner}/{repo}/contents/{path}', {
          owner: owner,
          repo: repo,
          path: result,
          message: `deleted the image ${result.replace('TastyTrails/Recipe/', ' ')}`,
          committer: {
            name: recipe.author,
            email: g_email
          },
          sha: sha,
          headers: {
            'X-GitHub-Api-Version': '2022-11-28'
          }
        });
      } catch (error) {
        // Handle and log any errors
        console.error('Error fetching file content:', error.response ? error.response.data : error.message);
        throw new Error('Failed to delete image from GitHub');
      }
    };

    // Try to delete the file from GitHub
    await fetchFileContent();


    // If successful, delete the recipe from the database
    await Recipe.deleteOne({ _id: req.body.id });

    return res.status(200).json({ success: true, message: "Recipe Deleted Successfully" });
  } catch (error) {
    console.error('Error deleting recipie:', error.response ? error.response.data : error.message);
    res.status(500).json({ success: false, message: error.message || "Internal server error" });
  }
};


// Added fucntions for adding and fetching comments

/**
 * @POST /api/recipe/addcomment
 * @description Add a comment to a recipe
 * @access private
 */
// controllers/commentController.js
const addComment = async (req, res) => {
  try {
    const { recipeId, content , username} = req.body;
    const userId = req.user.userId; // Assuming user is available in req.user after authentication middleware
    // Assuming username is available in req.user

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

    return res.status(201).json({ success: true, message: "Comment added successfully", comment: newComment });
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
    console.log('Fetching comments for recipe:', recipeId);

   
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ success: false, message: "Recipe not found" });
    }

  
    const recipeObjectId=new mongoose.Types.ObjectId(recipeId)
    const comments = await Comment.find({ recipe: recipeObjectId }).select('username content date').sort({ date: -1 });
    return res.status(200).json({ success: true, comments });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * @PATCH /api/recipe/share/:recipeId
 * @description update the number of share of recipe id
 * @access private
 */
//This function will update share count of any recipe

// controllers/commentController.js
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.userId;

    const comment = await Comment.findById(commentId);

 
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }


    if (comment.user.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "You are not authorized to delete this comment" });
    }

 
    await comment.remove();

    return res.status(200).json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


const updateShareCount = async (req, res) => {
  const { recipeId } = req.params
  if (!recipeId) {
    return res.status(400).json({ success: false, message: "Invalid request" })
  }

  try {
    const recipe = await Recipe.findById(recipeId)
    if (!recipe)
      return res.status(404).json({ success: false, message: "Recipe Not found!!" })
    const shareCount = recipe.share
    const updateStatus = await Recipe.findByIdAndUpdate(recipeId, {
      $set: {
        share: shareCount + 1
      }
    }, {
      new: true
    })
    if (!updateStatus)
      return res.status(500).json({ success: false, message: "Internal Server error" })
    return res.status(200).json({ success: true, updateStatus })
  } catch (error) {
    // console.log(error)
    res.status(500).json({ success: false, message: "Internal server error" });
  }

}


//Function to get individual recipe by ID. This will be needed when we share our recipe so in order to ensure that link works we need to make function that will fetch individual recipe by id
/**
 * @PATCH /api/recipe/:recipeId
 * @description get individual recipe by id
 * @access public
 */
const getRecipeById = async (req, res) => {
  try {
    const { recipeId } = req.params
    if (!recipeId) {
      return res.status(400).json({ success: false, message: "Invalid request" })
    }
    const recipeIdObejctId = new mongoose.Types.ObjectId(recipeId)
    if (!recipeIdObejctId) {
      return res.status(400).json({ success: false, message: "Invalid request" })
    }
    const recipe = await Recipe.findById(recipeIdObejctId)
    if (!recipe) {
      return res.status(400).json({ success: false, message: "Recipe Not Found" })
    }
    return res.status(200).json({ success: true, dish: recipe })
  } catch (error) {
    // console.log(error)
    return res.status(500).json({ success: false, message: "Internal Server error" })
  }
}

const RecipeController = {
  addRecipe,
  allRecipe,
  getOneUserRecipes,
  updateRecipe,
  deleteRecipe,
  addComment,
  getComments,
  updateShareCount,
  getRecipeById,
  deleteComment
}

export default RecipeController
