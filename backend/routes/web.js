import { Router } from "express";
import UserController from "../Controllers/UserController.js";
import RecipeController from "../Controllers/RecipeController.js";
import ChatbotController from "../Controllers/ChatbotController.js";
import authenticateToken from "../middleware/auth.js";

const router = Router();

// Get Requests
<<<<<<< HEAD
router.get('/usernames', UserController.getAllUserName)
router.get('/token', authenticateToken, UserController.verifyUserByToken)
router.get("/recipes", RecipeController.allRecipe)
=======
router.get("/usernames", UserController.getAllUserName);
router.get("/token", authenticateToken, UserController.verifyUserByToken);
router.get("/recipes", RecipeController.allRecipe);
>>>>>>> 2c3a6840f60182553c9345c7f4a9af5057c8f6a0
// added route to get previous comments
router.get("/recipe/getcomments/:recipeId", RecipeController.getComments);

// Post Requests
router.post("/signup", UserController.Signup);
router.post("/login", UserController.Login);
router.post("/recipe/add", authenticateToken, RecipeController.addRecipe);
router.post("/recipe/update", authenticateToken, RecipeController.updateRecipe);
router.post(
  "/recipe/readall",
  authenticateToken,
  RecipeController.getOneUserRecipes
);
router.post("/recipe/delete", authenticateToken, RecipeController.deleteRecipe);
router.post("/get-recipe", ChatbotController.getRecipeSuggestions);
// added route to add new comment to database
<<<<<<< HEAD
router.post("/recipe/addcomment", authenticateToken, RecipeController.addComment)
router.post('/feedback', UserController.Sendcontactmail);
router.patch('/recipe/share/:recipeId', authenticateToken, RecipeController.updateShareCount)
router.get('/recipe/:recipeId', RecipeController.getRecipeById)
=======
router.post(
  "/recipe/addcomment",
  authenticateToken,
  RecipeController.addComment
);
router.post("/feedback", UserController.Sendcontactmail);

>>>>>>> 2c3a6840f60182553c9345c7f4a9af5057c8f6a0
export default router;
