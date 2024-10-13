import Recipe from "../models/Recipe.js"
import Comment from "../models/Comment.js"
import axios from "axios"
import User from "../models/User.js"
import mongoose from "mongoose"
import { Octokit } from '@octokit/rest';

const g_owner = process.env.OWNER; 
const g_repo = process.env.REPO; 
const g_branch = process.env.BRANCH; 
const g_email=process.env.GITHUB_EMAIL;


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
  const owner = g_owner; 
  const repo = g_repo; 
  const branch = g_branch; 

  const base64Content = fileImage.split(';base64,').pop(); // Extract base64 content
  const fileContent = Buffer.from(base64Content, 'base64').toString('base64'); // Re-encode to base64
  const path = `TastyTrails/Recipe/${unique}${name}`; 
  const message = `Add ${unique} ${name} via API`; // Commit message
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  try {
    // Step 1: Check if the file already exists
    let fileExists = false;
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `TOKEN ${process.env.TOKEN}`,
          'X-GitHub-Api-Version': '2022-11-28',
        },
      });
      if (response.status === 200) {
        fileExists = true;
      }
    } catch (error) {
      // If file does not exist (404), proceed with creating it
      if (error.response && error.response.status === 404) {
        fileExists = false;
      } else {
        throw error;
      }
    }

    // Step 2: Upload or update the file based on existence
    const requestPayload = {
      message,
      content: fileContent,
      branch,
    };

    if (fileExists) {
      // If file exists, get the sha and update it
      const sha = (await axios.get(url, {
        headers: {
          Authorization: `TOKEN ${process.env.TOKEN}`,
          'X-GitHub-Api-Version': '2022-11-28',
        },
      })).data.sha;

      requestPayload.sha = sha; // Required for updates
    }

    // Step 3: Upload or update the file
    const response = await axios.put(url, requestPayload, {
      headers: {
        Authorization: `TOKEN ${process.env.TOKEN}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    if (response.status === 201 || response.status === 200) {
      return response.data.content.download_url; // Return the URL of the uploaded image
    } else {
      console.error('Failed to upload image:', response.status, response.statusText);
      return null;
    }

  } catch (error) {
    console.error('Error uploading image:', error.response ? error.response.data : error.message);
    return null;
  }
};


/**
 * @POST /api/recipes/readall
 * @description Returns recipe created by an User
 * @access private
 */
const getOneUserRecipes = async (req, res)=>{
  try{
    const recipes = await Recipe.find({user: req.body.id});
    return res.status(200).json({success: true, recipes})
  }catch(error){
   console.log(error);
   res.status(404).json({ success: false, message: "Internal server error" });
  }
}


/**
 * @POST /api/recipes/update
 * @description Updates a Recipe
 * @access private
 */
const updateRecipe = async (req, res)=>{
  try{ 
    const {name, description, ingredients, steps,type, user, author, id} = req.body
        const data = {
          user,
          name,
          description,
          ingredients,
          steps,
          author,
          type
        }
        const update = await Recipe.updateOne({_id: id}, {$set: data}, {new:true})
        return res.status(200).json({success: true, message: "Recipe Updates Successfully"})
  }catch(error){
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
    const branch=g_branch;
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
        const sha=response.data.sha;
        await octokit.request('DELETE /repos/{owner}/{repo}/contents/{path}', {
        owner: owner,
        repo: repo,
        path: result,
        message: `deleted the image ${result.replace('TastyTrails/Recipe/',' ')}`,
        committer: {
          name: recipe.author,
          email: g_email
        },
        sha:sha,
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
const addComment = async (req, res) => {
  try {
    const { recipeId, username, content } = req.body;

    // Ensure the recipe exists
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ success: false, message: "Recipe not found" });
    }

    // Create a new comment
    const newComment = new Comment({
      recipe: recipeId,
      username: username,
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
    const {recipeId} = req.params;
    console.log('Fetching comments for recipe:',recipeId);

    // Ensure the recipe exists
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ success: false, message: "Recipe not found" });
    }

    // Fetch all comments for this recipe
    const comments = await Comment.find({ recipe: recipeId }).select('username content date');
    console.log(comments);
    return res.status(200).json({ success: true, comments });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};



const RecipeController = {
  addRecipe,
  allRecipe,
  getOneUserRecipes,
  updateRecipe,
  deleteRecipe,
  addComment,
  getComments
}

export default RecipeController
