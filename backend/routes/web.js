import { Router } from "express";
import UserController from "../Controllers/UserController.js";
import RecipeController from "../Controllers/RecipeController.js";
import ChatController from "../Controllers/ChatController.js"
import MessageController from "../Controllers/MessageController.js";
import ChatbotController from "../Controllers/ChatbotController.js";
import authenticateToken from "../middleware/auth.js";

const router = Router();

// Get Requests
router.get('/usernames', UserController.getAllUserName)
router.get("/user/:id", UserController.getUserById);
router.get('/token', authenticateToken ,UserController.verifyUserByToken)
router.get("/recipes", RecipeController.allRecipe)
router.get("/chat/:userId",authenticateToken,ChatController.userChats)
router.get("/chat/find/:firstId/:secondId",authenticateToken,ChatController.findChat)
router.get("/message/:chatId",authenticateToken,MessageController.getMessages)
router.get('/users',authenticateToken, UserController.getAllUsers); // New endpoint to get all user data
// added route to get previous comments
router.get("/recipe/getcomments/:recipeId", RecipeController.getComments);

// Post Requests
router.post('/signup', UserController.Signup)
router.post('/login', UserController.Login)
router.post('/recipe/add', authenticateToken, RecipeController.addRecipe)
router.post('/recipe/update', authenticateToken, RecipeController.updateRecipe)
router.post(
  "/recipe/readall",
  authenticateToken,
  RecipeController.getOneUserRecipes
);
router.post('/recipe/delete', authenticateToken, RecipeController.deleteRecipe)
router.post("/get-recipe", ChatbotController.getRecipeSuggestions);
router.post('/feedback', UserController.Sendcontactmail);
router.post('/chat',authenticateToken,ChatController.createChat)
router.post("/message",authenticateToken,MessageController.addMessage)
// added route to add new comment to database
router.post(
  "/recipe/addcomment",
  authenticateToken,
  RecipeController.addComment
);
router.delete("/recipe/deletecomment/:commentId",authenticateToken,RecipeController.deleteComment)
export default router;
