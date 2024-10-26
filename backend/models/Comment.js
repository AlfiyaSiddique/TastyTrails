// models/Comment.js
import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Link to the user who made the comment
  username: { type: String, required: true }, 
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
