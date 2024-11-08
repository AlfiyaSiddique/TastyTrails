import User from "../models/User.js";

const verifyEmail = async (req, res) => {
    const { token } = req.query;
  
    try {
      const user = await User.findOne({ verificationToken: token });
      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }
  
      user.isVerified = true;
      user.verificationToken = undefined; // Remove the token after verification
      await user.save();
  
      res.status(200).json({ message: 'Account successfully verified' });
    } catch (error) {
      res.status(500).json({ message: 'Error verifying email' });
    }
  };

  const VerificationController = {
    verifyEmail
  };
  
export default VerificationController;