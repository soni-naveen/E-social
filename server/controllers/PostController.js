const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

// Create Post
exports.createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const post = new Post({ author: req.user.id, content });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: "Error creating post" });
  }
};
// Add Comment
exports.addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const comment = new Comment({
      author: req.user.id,
      post: postId,
      content,
    });
    await comment.save();
    await Post.findByIdAndUpdate(postId, {
      $push: {
        comments: comment._id,
      },
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding comment",
    });
  }
};
// Get Feed
exports.getFeed = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const userPost = await Post.find({ author: req.user.id })
      .populate("author", "username")
      .populate({
        path: "comments",
        populate: { path: "author", select: "username" },
      })
      .sort("-createdAt");
    const friendsPosts = await Post.find({ author: { $in: user.friends } })
      .populate("author", "username")
      .populate({
        path: "comments",
        populate: { path: "author", select: "username" },
      })
      .sort("-createdAt");

    const feed = [...userPost, ...friendsPosts]
      .sort((a, b) => b.createdAt - a.createdAt)
      .map((post) => ({
        ...post.toObject(),
      }));

    res.json(feed);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching feed",
    });
  }
};
// Like Post
exports.likePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const userHasLiked = post.likes.includes(userId);
    const message = userHasLiked ? "Post unliked" : "Post liked";

    if (userHasLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }
    await post.save();

    return res.json({
      success: true,
      message,
    });
  } catch (error) {
    console.error("Error in like/unlike post:", error);
    return res.status(500).json({
      success: false,
      message: "Error processing like/unlike",
      details: error.message,
    });
  }
};
// Delete Post
exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this post" });
    }

    await Post.findByIdAndDelete(postId);

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
