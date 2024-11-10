import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Feedback from "../models/feedback.js";
import Recipe from "../models/Recipe.js";
import Comment from "../models/Comment.js";
import {sendVerificationEmail} from "../Utils/emailUtils.js";
import crypto from "crypto";

dotenv.config();



/**
 * @route {POST} /api/signup
 * @description Create a new user
 * @access public
 */
const Signup = async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;

  try {
    // Check if email or username is already registered
    const existingEmail = await User.findOne({ email });
    const existingUsername = await User.findOne({ username });

    if (existingEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Email Already Registered" });
    }

    if (existingUsername) {
      return res
        .status(400)
        .json({ success: false, message: "Username Already Exists" });
    }

    // Encrypt password
    const encryptedPassword = bcrypt.hashSync(password, 10);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Create new user with encrypted password and verification token
    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      password: encryptedPassword,
      verificationToken,
    });

    
    // Save user to the database
    await newUser.save();
    const token = jwt.sign({ userId: newUser._id }, process.env.SECRET, {
      expiresIn: "30d",
    });
    // Send verification email
    await sendVerificationEmail(email, verificationToken, token, newUser._id);

    res.status(201).json({
      success: true,
      message: "Please check your email to verify your account",
      user: newUser,
      token: token,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Internal server error" });
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
    const user = await User.findOne(
        { email: req.body.searchTerm });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not Exist" });
    }

    // Check if the user is verified
    if (!user.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Account not verified. Please verify first" });
    }

    const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);

    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect Password" });
    }

    // If the password is correct, generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.SECRET, {
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
const deleteUnverifiedUsers = async () => {
  try {
    const now = new Date();
    const expirationTime = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago

    const deletedUsers = await User.deleteMany({
      isVerified: false,
      createdAt: { $lt: expirationTime }
    });

    console.log(`Deleted ${deletedUsers.deletedCount} unverified accounts older than 24 hours`);
  } catch (error) {
    console.error('Error deleting unverified accounts:', error);
  }
};




const toggleFollowUser = async (req, res) => {
  const { userId, username: followerUsername } = req.body; 
  try {
    // Check if the target user exists
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the logged-in user by their username
    const loggedInUser = await User.findOne({ username: followerUsername });

    if (!loggedInUser) {
      return res.status(404).json({ message: "Logged-in user not found" });
    }

    // Check if already following
    const isFollowing = targetUser.followers.includes(loggedInUser._id);

    if (isFollowing) {
      // Unfollow: Remove the target user from logged-in user's following and vice versa
      targetUser.followers = targetUser.followers.filter(
        (followerId) => followerId.toString() !== loggedInUser._id.toString()
      );
      loggedInUser.following = loggedInUser.following.filter(
        (followingId) => followingId.toString() !== targetUser._id.toString()
      );
      await targetUser.save();
      await loggedInUser.save();

      return res.status(200).json({
        message: `Successfully unfollowed ${targetUser.username}`,
        username: targetUser.username,
        followingCount: loggedInUser.following.length,
        followersCount: targetUser.followers.length,
      });
    } else {
      // Follow: Add the target user to logged-in user's following and vice versa
      targetUser.followers.push(loggedInUser._id);
      loggedInUser.following.push(targetUser._id);
      await targetUser.save();
      await loggedInUser.save();

      return res.status(200).json({
        message: `Successfully followed ${targetUser.username}`,
        username: targetUser.username,
        followingCount: loggedInUser.following.length,
        followersCount: targetUser.followers.length,
      });
    }
  } catch (error) {
    console.error("Error toggling follow status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};




import mongoose from "mongoose";

const getFollowerAndFollowingList = async (req, res) => {
  const { id } = req.params; // Get the user ID from route params

  // Check if the user ID is valid (mongoose checks for ObjectId format)
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    // Find the user with the provided ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch the followers' details
    const followers = await User.find({ '_id': { $in: user.followers } })
      .select('firstName lastName username profile');  // Only select necessary fields

    // Fetch the following details
    const following = await User.find({ '_id': { $in: user.following } })
      .select('firstName lastName username profile');  // Only select necessary fields

    // Return the followers and following data
    return res.json({
      followers,
      following,
    });
  } catch (err) {
    console.error("Error fetching followers and following", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export { getFollowerAndFollowingList };




const UserController = {
  Signup,
  Login,
  getAllUserName,
  toggleFollowUser,
  getFollowerAndFollowingList,
  deleteUserById,
  verifyUserByToken,
  forgotPassword,
  resetPassword,
  UpdateImage,
  FetchUser,
  submitFeedback,
  getAllFeedback,
  getFeedbackByUserId,
  deleteFeedbackById,
  deleteUnverifiedUsers
};


export default UserController;
