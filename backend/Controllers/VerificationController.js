import User from "../models/User.js";

import crypto from "crypto";
import { sendVerificationEmail } from "../Utils/emailUtils.js";
const verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined; // Remove the token after verification
    await user.save();

    res.status(200).json({ message: "Account successfully verified" });
  } catch (error) {
    res.status(500).json({ message: "Error verifying email" });
  }
};

const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Account is already verified" });
    }

    // Generate a new verification token and resend the email
    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.verificationToken = verificationToken;

    // Save the updated user and resend the email
    await user.save();
    await sendVerificationEmail(user.email, verificationToken, user.token, user._id);

    res
      .status(200)
      .json({ message: "Verification email resent. Please check your inbox." });
  } catch (error) {
    res.status(500).json({ message: "Error resending verification email" });
  }
};

const VerificationController = {
  verifyEmail,
  resendVerificationEmail,
};
export default VerificationController;


