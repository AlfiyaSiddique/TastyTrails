import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true }, // Link to the related recipe
  username: { type: String, required: true },     // User who made the comment
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;