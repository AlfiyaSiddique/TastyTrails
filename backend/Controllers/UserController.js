import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
/**
 * @route {POST} /api/signup
 * @description Create a new user
 * @access public
 */
const Signup = async (req, res) => {
  try {
    const encryptPassword = bcrypt.hashSync(req.body.password, 10);
    const newUser = new User({ ...req.body, password: encryptPassword });

    const user = await User.findOne({ email: req.body.email });
    const username = await User.findOne({ username: req.body.username });

    if (user)
      return res
        .status(400)
        .json({ success: false, message: "Email Already Registered" });

    if (username)
      return res
        .status(400)
        .json({ success: false, message: "Username Already Exist" });

    const createdUser = await newUser.save();
    const token = jwt.sign({ userId: createdUser._id }, process.env.SECRET, {
      expiresIn: "30d",
    });
    res.status(200).json({ success: true, user: createdUser, token: token });
  } catch (error) {
    console.log(error);
    res.status(404).json({ success: false, message: "Internal server error" });
  }
};

/**
 * @route {GET} /api/login
 * @description Returns an array of username
 * @access public
 */
const getAllUserName = async (req, res) => {
  try {
    const names = await User.find({}, { username: 1, _id: 0 });
    const nameArr = [];
    names.forEach((val) => nameArr.push(val.username));
    res.status(200).json({ usernames: nameArr, success: true });
  } catch(error){
    console.log(error)
    res.status(404).json({ success: false, message: "Internal server error" });
  }
};

/**
 * @route {POST} /api/usernames
 * @description Authenticates an User
 * @access public
 */
const Login = async (req, res) => {
  try {
    const user = await User.findOne({
      $or: [
        { email: req.body.searchTerm }, // Search by email
        { username: req.body.searchTerm }, // Search by username
      ],
    });

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not Exist" });

    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!isPasswordCorrect)
      return res
        .status(400)
        .json({ success: false, message: "Incorrect Password" });

    // If the password is correct, generate a JWT token
    const token = jwt.sign(
      { userId: user._id},
      process.env.SECRET,
      {
        expiresIn: "30d",
      }
    );
    res.status(200).json({ success: true, user: user, token: token });
  } catch (error) {
    console.log(error);
    return res
      .status(404)
      .json({ success: false, message: "Internal Server Error" });
  }
};

/**
 * @route {POST} /api/token
 * @description Verifies an user token an implement session
 * @access public
 */
const verifyUserByToken =  async (req, res)=>{
  try{
        const user = await User.findById(req.user.userId)
        console.log(req.user)
        return res.status(200).json({success: true, user})
  }catch (error){
    console.log(error);
    return res
      .status(404)
      .json({ success: false, message: "Internal Server Error" });
  }
 
}

const UserController = {
  Signup,
  Login,
  getAllUserName,
  verifyUserByToken
};

export default UserController;
