import { Router } from "express";
import UserController from "../Controllers/UserController.js";
import RecipeController from "../Controllers/RecipeController.js";
import ChatbotController from "../Controllers/ChatbotController.js";
import authenticateToken from "../middleware/auth.js";

const router = Router();

// Get Requests
router.get("/usernames", UserController.getAllUserName);
router.get("/token", authenticateToken, UserController.verifyUserByToken);
router.get("/recipes", RecipeController.allRecipe);
// added route to get previous comments
router.get("/recipe/getcomments/:recipeId", RecipeController.getComments);
// Post Requests
router.post("/signup", UserController.Signup);
router.post("/login", UserController.Login);
router.post("/feedback", UserController.submitFeedback);
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
router.post(
  "/recipe/addcomment",
  authenticateToken,
  RecipeController.addComment
);

router.post("/forgot_password", UserController.forgotPassword);
router.post("/reset_password/:token", UserController.resetPassword);
router.post("/recipe/like", authenticateToken, RecipeController.addRecipeLike);
router.post(
  "/recipe/unlike",
  authenticateToken,
  RecipeController.removeRecipeLike
);
router.post("/recipe/liked_recipes", RecipeController.getLikedRecipe);
router.delete(
  "/recipe/deletecomment/:commentId",
  authenticateToken,
  RecipeController.deleteComment
);
export default router;