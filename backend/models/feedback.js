// models/feedback.js
import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
}, { timestamps: true }); // Adds createdAt and updatedAt fields automatically

const Feedback = mongoose.model('Feedback', FeedbackSchema);
export default Feedback;
