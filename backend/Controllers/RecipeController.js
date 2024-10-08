import Recipe from "../models/Recipe.js"
import axios from "axios"
import { Octokit } from '@octokit/rest';

const owner = process.env.OWNER; 
const repo = process.env.REPO; 
const branch = process.env.BRANCH; 
const email=process.env.GITHUB_EMAIL;
/**
 * @route {POST} /api/recipe/add
 * @description Add a REcipe to database
 * @access private
 */

const addRecipe = async (req, res)=>{
  try{ 
    const {name, description, ingredients, steps,type, image, imagename, user, author} = req.body
        const lastDocument = await Recipe.findOne().sort({ _id: -1 }); 
        const unique = lastDocument._id.toString()
        const URL = await imageToGithub(image, imagename, unique.slice(-4))
        const data = {
          user,
          name,
          description,
          ingredients,
          steps,
          image: URL,
          author,
          type
        }
        const newRecipe =  new Recipe(data)
        const saved = await newRecipe.save()
        return res.status(200).json({success: true, message: "Recipe Published Successfully"})
  }catch(error){
    console.log(error);
    res.status(404).json({ success: false, message: "Internal server error" });
  }
}

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
const imageToGithub = async (fileImage, name, unique)=>{

  const base64Content = fileImage.split(';base64,').pop();
  const fileContent = Buffer.from(base64Content, 'base64').toString('base64');
  const path = `TastyTrails/Recipe/${unique}${name}`; 
  const message = `Add ${unique} ${name} via API`; // Commit message
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  try {
    const response = await axios.put(
      url,
      {
        message,
        content: fileContent,
        branch,
      },
      {
        headers: {
          Authorization: `TOKEN ${process.env.TOKEN}`,
          'X-GitHub-Api-Version': '2022-11-28'
        },
      }
    );

    if (response.status === 201) {
      return response.data.content.download_url; // Returns the URL of the uploaded image
    } else {
      console.error('Failed to upload image:', response.status, response.statusText);
      return null;
    }
  } catch (error) {
    console.error('Error uploading image:', error.message);
    console.error('Error uploading image:', error.response ? error.response.data : error.message);
    return null;
  }
}

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
    const result = trimUrl(imageName, owner, repo);

    const octokit = new Octokit({
      auth: process.env.TOKEN
    });

    function trimUrl(url, owner, repo) {
      // To remove the unncessary part from the URL
      const parsedUrl = new URL(url);
      const trimmedPath = parsedUrl.pathname.slice(1);
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
        const sha=response.data.sha;
        // Getting the SHA key so that it can assist in deletion
        await octokit.request('DELETE /repos/{owner}/{repo}/contents/{path}', {
        owner: owner,
        repo: repo,
        path: result,
        message: 'deleted the image',
        committer: {
          name: recipe.author,
          email: email
        },
        sha:sha,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
    })
      } catch (error) {
        // Handle and log any errors
        console.error('Error fetching file content:', error.response ? error.response.data : error.message);
      }
    };

    // Execute the function
    fetchFileContent();
   

    // Remove the recipe from the database
    await Recipe.deleteOne({ _id: req.body.id });

    return res.status(200).json({ success: true, message: "Recipe Deleted Successfully" });
  } catch (error) {
    console.error('Error fetching file from GitHub:', error.response ? error.response.data : error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


const RecipeController = {
    addRecipe,
    allRecipe,
    getOneUserRecipes,
    updateRecipe,
    deleteRecipe
}

export default RecipeController
