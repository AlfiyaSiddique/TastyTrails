import Recipe from "../models/Recipe.js"


/**
 * @route {POST} /api/recipe/add
 * @description Add a REcipe to database
 * @access private
 */

const addRecipe = async (req, res)=>{
  try{ 
        const newRecipe =  new Recipe(req.body)
        const saved = await newRecipe.save()
        return res.status(200).json({success: true, message: "Recipe Published Successfully"})
  }catch(error){
    console.log(error);
    res.status(404).json({ success: false, message: "Internal server error" });
  }
}

const allRecipe = async (req,res)=>{
   try{
     const recipes = await Recipe.find({});
     return res.status(200).json({success: true, recipes})
   }catch(error){
    console.log(error);
    res.status(404).json({ success: false, message: "Internal server error" });
  }
}

const RecipeController = {
    addRecipe,
    allRecipe
}

export default RecipeController
