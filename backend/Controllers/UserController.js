import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Feedback from "../models/feedback.js";
import Recipe from "../models/Recipe.js";
import Comment from "../models/Comment.js";
dotenv.config();



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
    console.log(error);
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
        { email: req.body.email }, // Search by email
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
    const token = jwt.sign({ userId: user._id  }, process.env.SECRET, {
      expiresIn: "30d",
    });
  
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
    const user = await User.findById(req.user.userId);
    return res.status(200).json({ success: true, user });
  
  } catch (error) {
    console.log(error);
    return res
      .status(404)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const FetchUser = async (req, res) => {
  try {
    const {id} = req.body
    if (!id) {
      return res.status(400).json({ success: false, message: "Invalid request" })
    }
    const userData = await User.find({_id: id})
    if (!userData) {
      return res.status(400).json({ success: false, message: "User Not Found" })
    }
    return res.status(200).json(userData[0])
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: "Internal Server error" })
  }
  
}

const UpdateImage = async (req, res) => {
  try {
    const { id, profile} = req.body
    const update = await User.updateOne({ _id: id }, { $set: {profile: profile} }, { new: true })
    return res.status(200).json({ success: true, message: "Image Updates Successfully" })
  } catch (error) {
    console.log(error);
    res.status(404).json({ success: false, message: "Internal server error" });
  }
}

const forgotPassword = async function (req, res) {
  const { email } = req.body;
  const user = await User.findOne({ email });
  try {
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Email doesnt exist" });
    } else {
      const token = jwt.sign({ userId: user._id }, process.env.SECRET, {
        expiresIn: "5m",
      });
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD,
        },
      });
      var userFullName = user.firstName + " " + user.lastName;
      var mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: email,
        subject: "Password Reset | TastyTrails",
        html: `<p>Hi <b> ${userFullName},</b><br>Use the below link to reset you password. Remember, the link will expire in 10 minutes.<br> ${process.env.FRONT_END_URL}/reset_password/${token}`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return res
            .status(404)
            .json({ success: false, message: "Email not sent" });
        } else {
          return res
            .status(200)
            .json({ success: true, message: "Email sent succesfully" });
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const resetPassword = async function (req, res) {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    console.log(decoded);
    const id = decoded.userId;
    const hashPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate({ _id: id }, { password: hashPassword });
    return res
      .status(200)
      .json({ success: true, message: "Password reset succesfully" });
  } catch (error) {
    return res.status(400).json({ success: false, message: "Invalid token" });
  }
};
const submitFeedback = async (req, res) => {
  const { userId, role, review, rating, quote } = req.body; // Capture data from the request

  try {
    // Create a new feedback document
    const newFeedback = new Feedback({
      userId,
      role,
      review,
      rating,
      quote,
    });

    // Save feedback to the database
    await newFeedback.save();

    return res
      .status(200)
      .json({
        success: true,
        message: "Feedback stored successfully!",
        newFeedback,
      });
  } catch (error) {
    console.error("Error storing feedback:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error storing feedback" });
  }
}
const getAllFeedback = async (req, res) => {
  try {
    // Retrieve all feedback, populating the user details
    const feedbackEntries = await Feedback.find().populate('userId', 'firstName lastName profile'); // Adjust fields as needed

    return res.status(200).json({
      success: true,
      message: "Feedback retrieved successfully!",
      data: feedbackEntries,
    });
  } catch (error) {
    console.error("Error retrieving feedback:", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving feedback",
    });
  }
}
const getFeedbackByUserId = async (req, res) => {
  const { userId } = req.params; // Extract userId from params

  try {
    // Find all feedback entries by userId and populate user details
    const feedbackEntries = await Feedback.find({ 'userId._id': userId }).populate('userId', 'firstName lastName profile');

    // Check if feedback entries were found
    if (!feedbackEntries.length) {
      return res.status(404).json({
        success: false,
        message: "No feedback found for this user",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Feedback retrieved successfully!",
      data: feedbackEntries,
    });
  } catch (error) {
    console.error("Error retrieving feedback by userId:", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving feedback",
    });
  }
};
// Feedback deletion controller
const deleteFeedbackById = async (req, res) => {
  const { id } = req.body;

  try {
    // Find and delete the feedback by ID
    const deletedFeedback = await Feedback.findByIdAndDelete(id);

    // Check if feedback was found and deleted
    if (!deletedFeedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Feedback deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting feedback:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting feedback",
    });
  }
};




const deleteUserById = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the user by ID and delete
    const deletedUser = await User.findByIdAndDelete(id);

    // Check if the user was found and deleted
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    
    await Recipe.deleteMany({ user: id });
    await Comment.deleteMany({ user: id });
    await Feedback.deleteMany({ userId: id });


    return res.status(200).json({
      success: true,
      message: "User deleted successfully!",
      data: deletedUser,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting user",
    });
  }
};


const UserController = {
  Signup,
  Login,
  getAllUserName,
  deleteUserById,
  verifyUserByToken,
  forgotPassword,
  resetPassword,
  UpdateImage,
  FetchUser,
  submitFeedback,
  getAllFeedback,
  getFeedbackByUserId,
  deleteFeedbackById
};


export default UserController;
