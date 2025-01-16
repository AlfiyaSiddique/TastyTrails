
import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema({
  userId : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // References the User model
  role: { type: String, required: true },
  review: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  quote: { type: String, required: false }, // Optional quote field
}, { timestamps: true }); // Adds createdAt and updatedAt fields automatically

const Feedback = mongoose.model('Feedback', FeedbackSchema);
export default Feedback;
