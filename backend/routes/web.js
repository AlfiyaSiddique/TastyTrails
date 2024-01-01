import { Router } from "express";
import UserController from "../Controllers/UserController.js";

const router = Router();

router.post('/signup', UserController.Signup)
router.post('/login', UserController.Login)
router.get('/usernames', UserController.getAllUserName)

export default router;
