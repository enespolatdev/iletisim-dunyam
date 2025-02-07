import Comment from "../models/Comment.js";
import User from "../models/User.js";

/* CREATE */
export const createComment = async (req, res) => {
  try {
    const { userId, postId, comment } = req.body;
    const user = await User.findById(userId);
    
    const newComment = new Comment({
      userId,
      postId,
      comment,
      firstName: user.firstName,
      lastName: user.lastName,
      userPicturePath: user.picturePath,
    });
    await newComment.save();

    const comments = await Comment.find({ postId: postId }).sort({ createdAt: -1 });
    res.status(201).json(comments);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ postId: postId }).sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* DELETE */
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id);
    
    if (!comment) {
      return res.status(404).json({ message: "Yorum bulunamadı" });
    }
    
    await Comment.findByIdAndDelete(id);
    const comments = await Comment.find({ postId: comment.postId }).sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}; 