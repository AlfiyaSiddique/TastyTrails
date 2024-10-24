import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import nodemailer from "nodemailer";
dotenv.config()
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
  } catch (error) {
    console.log(error)
    res.status(404).json({ success: false, message: "Internal server error" });
  }
};

/**
 * @route {GET} /api/user/:id
 * @description Get details of a user by ID
 * @access public
 */
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
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
      { userId: user._id },
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
const verifyUserByToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    return res.status(200).json({ success: true, user })
  } catch (error) {
    console.log(error);
    return res
      .status(404)
      .json({ success: false, message: "Internal Server Error" });
  }

}

/**
 * @route {GET} /api/users
 * @description Get details of all users
 * @access public
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { username: 1, email: 1, _id: 1 });
    res.status(200).json({ users, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

async function Sendcontactmail(req, res) {
  const { name, email, message, rating } = req.body; // Capture rating from the request
  console.log(req.body);
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Create a string of stars based on the rating, filled and unfilled stars
    const totalStars = 5;
    const filledStars = '★'.repeat(rating);   // Filled stars
    const emptyStars = '☆'.repeat(totalStars - rating); // Empty stars

    const mailOptions = {
      from: email,
      to: process.env.RESPONSE_MAIL,
      subject: `Feedback from ${name}`,
      text: message,
      html: `
        <p>You have received a new message from the Feedback form:</p>
        <h3>Contact Details:</h3>
        <ul>
          <li>Name: ${name}</li>
          <li>Email: ${email}</li>
        </ul>
        <h3>Message:</h3>
        <p>${message}</p>

        <h3>Rating:</h3>
        <p style="font-size: 24px; color: #FFD700;">${filledStars}${emptyStars}</p> <!-- Display the stars -->
      `, // HTML body
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ success: false, message: 'Error sending email' });
  }
}


const UserController = {
  Signup,
  Login,
  getAllUserName,
    getAllUsers,  // Added new endpoint
  verifyUserByToken,
  Sendcontactmail,
  getUserById
};

export default UserController;
