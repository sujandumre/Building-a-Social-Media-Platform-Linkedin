
import jwt from "jsonwebtoken";
import Profile from "../models/profile.model.js";
import bcrypt from "bcrypt";
import Post from "../models/posts.model.js";
import User from "../models/user.model.js";
import Comment from "../models/comments.model.js";
import ConnectionRequest from "../models/connection.model.js";


export const activeCheck = async (req,res)=>{
  return res.status(200).json({message:"RUNNING"})

}

export const register = async (req,res)=>{

  try{
const {name,email,password, username}=req.body;

if(!name || !email || !password || !username) return res.status(400).json({message:"All fields are required"});

const user = await User.findOne({
  email
});
if(user) return res.status(400).json({message:"User already exists"});

const hashedPassword = await bcrypt.hash(password,10);
const newUser = new User({
  name,
  email,
  password:hashedPassword,
  username
});
await newUser.save();

const profile = new Profile({
  userId:newUser._id
});

await profile.save();
return res.json({message:"User registered successfully"});

  }catch(error) {
    return res.status(500).json({message:"error.message"})
  }
}




export const createPost = async (req, res) => {
  try {
    const { token, body } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // ← decode token
    const user = await User.findById(decoded.id); // ← find by id
    if (!user) return res.status(404).json({ message: "User not found" });

    // const post = new Post({
    //   userId: user._id,
    //   body: body || "",
    //   media: req.file ? req.file.filename : "",
    //   fileType: req.file ? req.file.mimetype.split("/")[1] : "",
    // });
    const post = new Post({
  userId: user._id,
  body: body || "",
  media: req.file ? req.file.path : "",  // ← change filename to path
  fileType: req.file ? req.file.mimetype.split("/")[1] : "",
});

    const savedPost = await post.save();

    return res.status(201).json({
      message: "Post created successfully",
      post: savedPost,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const getAllPosts = async (req,res) =>{
  try {
    const posts = await Post.find().populate('userId', 'name username email profilePicture');
    
    return res.json({posts});
  } catch (error) {
    return res.status(500).json({message:error.message});
  }
}


export const deletePost = async (req, res) => {
  const { token, post_id } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("_id");
    if (!user) return res.status(404).json({ message: "User not found" });

    const post = await Post.findOne({ _id: post_id });
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.userId.toString() !== user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await Post.deleteOne({ _id: post_id });
    return res.json({ message: "Post deleted successfully" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const get_comments_by_post = async (req, res) => {
  try {
    const { post_id } = req.body;

    if (!post_id) {
      return res.status(400).json({ message: "post_id is required" });
    }

    const comments = await Comment.find({ postId: post_id })
      .populate("userId", "name username profilePicture");

    return res.status(200).json({ comments });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};




export const delete_comment_of_user = async (req, res) => {
  try {
    const { commentId } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // ← decode token
    const user = await User.findById(decoded.id); // ← find by id
    if (!user) return res.status(401).json({ message: "Invalid token" });

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.userId.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    await Comment.findByIdAndDelete(commentId);
    res.status(200).json({ message: "Comment deleted" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const increment_likes = async (req,res) => {
  const {post_id }= req.body;

  try {
    const post = await Post.findOne({_id:post_id});
    if (!post) {
      return res.status(404).json({message:"Post not found"});
    }
    post.likes = post.likes +1;

    await post.save();
    return res.json({message: "likes increamented"});
    
  } catch (error) {
    return res.status(500).json({message:error.message});
  }
}


export const create_comment = async (req, res) => {
  try {
    const { postId, body } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "No token" });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // ← decode token
    const user = await User.findById(decoded.id); // ← find by id
    if (!user) return res.status(401).json({ message: "Invalid token" });

    const comment = await Comment.create({ postId, body, userId: user._id });
    const populated = await comment.populate("userId", "name username profilePicture");

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const sendConnectionRequest = async (req, res) => {
  const { token, connectionId } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const connectionUser = await User.findById(connectionId);
    if (!connectionUser) return res.status(404).json({ message: "Connection user not found" });

    const alreadySent = user.connectionRequests?.sent?.includes(connectionId);
    const alreadyConnected = user.connections?.includes(connectionId);

    if (alreadySent || alreadyConnected) {
      return res.status(400).json({ message: "Request already sent or already connected" });
    }

    await User.findByIdAndUpdate(user._id, {
      $addToSet: { "connectionRequests.sent": connectionId }
    });

    await User.findByIdAndUpdate(connectionId, {
      $addToSet: { "connectionRequests.received": user._id }
    });

    return res.status(200).json({ message: "Connection request sent successfully" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const toggle_like = async (req, res) => {
  const { post_id, token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const post = await Post.findById(post_id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const alreadyLiked = post.likedBy?.includes(decoded.id);

    if (alreadyLiked) {
      post.likedBy = post.likedBy.filter((id) => id.toString() !== decoded.id);
      post.likes = Math.max(0, post.likes - 1);
    } else {
      post.likedBy.push(decoded.id);
      post.likes = post.likes + 1;
    }

    await post.save();
    return res.json({ message: alreadyLiked ? "Unliked" : "Liked", likes: post.likes });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};