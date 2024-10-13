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

    const postsWithFriendsComments = await Post.find({
      author: { $nin: [...user.friends, req.user.id] },
      comments: { $elemMatch: { author: { $in: user.friends } } },
    })
      .populate("author", "username")
      .populate({
        path: "comments",
        populate: { path: "author", select: "username" },
      })
      .sort("-createdAt");

    const feed = [...userPost, ...friendsPosts, ...postsWithFriendsComments]
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
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const likeIndex = post.likes.indexOf(userId);
    if (likeIndex > -1) {
      // User has already liked the post, so unlike it
      post.likes.splice(likeIndex, 1);
      await post.save();
      res.json({
        success: true,
        message: "Post unliked successfully",
      });
    } else {
      // User hasn't liked the post, so like it
      post.likes.push(userId);
      await post.save();
      res.json({
        success: true,
        message: "Post liked successfully",
      });
    }
  } catch (error) {
    console.error("Error in like/unlike post:", error);
    res.status(500).json({
      success: true,
      message: "Error processing like/unlike",
      details: error.message,
    });
  }
};
