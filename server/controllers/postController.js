const Post = require("../models/post.model");
const User = require("../models/user.model");

exports.submitPost = async (req, res) => {
  const { title, description } = req.body;

  try {
    const newPost = new Post({
      title,
      description,
      user: req.user._id,
    });

    await newPost.save();
    await User.findByIdAndUpdate(req.user._id, { $push: { posts: newPost._id } });

    res.status(201).json({ message: "Post submitted successfully", post: newPost });
  } catch (err) {
    console.error("Post submission error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
