import { Router } from "express";
import UserController from "../Controllers/UserController.js";
import RecipeController from "../Controllers/RecipeController.js";
import ChatbotController from "../Controllers/ChatbotController.js";
import authenticateToken from "../middleware/auth.js";
import VerificationController from "../Controllers/VerificationController.js"
const router = Router();

// Get Requests
router.get("/usernames", UserController.getAllUserName);
router.get("/token", authenticateToken, UserController.verifyUserByToken);
router.get("/recipes", RecipeController.allRecipe);
// added route to get previous comments
router.get("/recipe/getcomments/:recipeId", RecipeController.getComments);
// Post Requests

    //  Signup ROUTES
router.post("/signup", UserController.Signup);
router.get("/verify-account", VerificationController.verifyEmail);
router.post("/reverify-account", VerificationController.resendVerificationEmail);

router.post("/login", UserController.Login);
router.get("/user/:id/followers-following", UserController.getFollowerAndFollowingList);
router.post("/submitFeedback", UserController.submitFeedback);
router.post("/follow", UserController.toggleFollowUser);
router.get('/feedback', UserController.getAllFeedback);
router.get('/feedback/:id', UserController.getFeedbackByUserId);
router.post("/feedback/delete", UserController.deleteFeedbackById);
router.post("/user/imageUpdate", UserController.UpdateImage);
router.post("/user/fetch", UserController.FetchUser);
router.delete("/user/:id", UserController.deleteUserById);
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

router.patch("/recipe/share/:recipeId", authenticateToken, RecipeController.updateShareCount);
export default router;
