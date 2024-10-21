import { Router } from "express";
import UserController from "../Controllers/UserController.js";
import RecipeController from "../Controllers/RecipeController.js";
import authenticateToken from "../middleware/auth.js";

const router = Router();


// Get Requests
router.get('/usernames', UserController.getAllUserName)
router.get('/token', authenticateToken ,UserController.verifyUserByToken)
router.get("/recipes", RecipeController.allRecipe)
// added route to get previous comments
router.get('/recipe/getcomments/:recipeId', RecipeController.getComments)

// Post Requests
router.post('/signup', UserController.Signup)
router.post('/login', UserController.Login)
router.post('/recipe/add', authenticateToken, RecipeController.addRecipe)
router.post('/recipe/update', authenticateToken, RecipeController.updateRecipe)
router.post('/recipe/readall', authenticateToken, RecipeController.getOneUserRecipes)
router.post('/recipe/delete', authenticateToken, RecipeController.deleteRecipe)
// added route to add new comment to database
router.post("/recipe/addcomment",authenticateToken, RecipeController.addComment)
router.delete("/recipe/deletecomment/:commentId",authenticateToken,RecipeController.deleteComment)
router.post('/feedback', UserController.Sendcontactmail);

export default router;
