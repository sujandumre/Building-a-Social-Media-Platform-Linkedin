import User from "../models/user.model.js";
// import jwt from "jsonwebtoken";
import Profile from "../models/profile.model.js";
import bcrypt from "bcrypt";
import Post from "../models/posts.model.js";

import Comment from "../models/comments.model.js";



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

// export const createPost = async (req,res) =>{
//   const { token } = req.body;

//   try {
//     const user = await User.findOne({ token: token});
//     if(!user) {
//       return res.status(404).json({message: "user not found"});
//     }

//     const post = new Post({
//       userId: user._id,
//       body: req.body.body,
//       media: req.file != undefined ? req.file.filename : "",
//       fileType: req.file != undefined ? req.file.mimetype.split("/")[1]: ""
//     });

//     await post.save();
//     return res.status(200).json({message: "Post created"});

//   } catch (error) {
//     return res.status(500).json({message:error.message})
//   }
// }



export const createPost = async (req, res) => {
  try {
    const { token, body } = req.body;

    // ✅ Check user
    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Create post
    const post = new Post({
      userId: user._id,
      body: body || "",
      // media: req.file ? req.file.path : "",   // better than filename
      // media: req.file ? req.file.filename : "",
      media: req.file.filename,
      fileType: req.file ? req.file.mimetype.split("/")[1] : "",
    });

    // ✅ Save to DB
    const savedPost = await post.save();

    // ✅ Return full data (important)
    return res.status(201).json({
      message: "Post created successfully",
      post: savedPost,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
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

export const deletePost = async (req,res) =>{

  const { token, post_id} = req.body;

  try {
    const user = await User.findOne({ token: token}).select("_id");
    if(!user) {
      return res.status(404).json({message: "user not found"});
    }

    const post = await Post.findOne({_id:post_id});
    if(!post) {
      return res.status(404).json({message: "post not found"});
    }
    if (post.userId.toString() !== user._id.toString()) {
      return res.status(401).json({message:"Unauthorized"});
    }

    await Post.deleteOne({_id:post_id});

  } catch (error) {
    return res.status(500).json({message:error.message});
  }
}

// export const get_comments_by_post = async (req,res)=>{
//   // const { post_id } = req.query
//   const post = await Post.findById(req.body.post_id);

//   try {
//     const post= await Post.findOne({_id:post_id});
//     if(!post) {
//       return res.status(404).json({message: "post not found"});
//     } 
//     return res.status(404).json({comments:post.comments});

//   } catch (error) {
//     return res.status(500).json({message:error.message});
//   }
// }

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

    // ✅ Find user by token (same pattern as create_comment)
    const user = await User.findOne({ token: token });
    if (!user) return res.status(401).json({ message: "Invalid token" });

    // ✅ Find comment and verify ownership
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // ✅ Only allow delete if this user owns the comment
    if (comment.userId.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    await Comment.findByIdAndDelete(commentId);
    res.status(200).json({ message: "Comment deleted" });

  } catch (err) {
    console.error("❌ DELETE COMMENT ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
};



// export const delete_comment_of_user = async (req,res) =>{
//   const { token,post_id,comment_id} = req.body;
//   try {

//     const user = await User.findOne({ token:token}).select("_id");
//     if (!user) {
//       return res.status(404).json({message:"User not found"});
//     }

//     const comment = await Comment.findOne({"  _id":comment_id});
//     if (!comment) {
//       return res.status(404).json({message:"Comment not found"});
//     }
//     if (comment.userId.toString() !== user._id.toString()){
//       return res.status(401).json({message:"Unauthorized"});  
//     }
//     await Comment.deleteOne({"_id":comment_id});
//     return res.status(200).json({message:"Comment deleted successfully"});

//   } catch (error) {
//     return res.status(500).json({message:error.message});
//   }
// }

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

    // ✅ Your User model has a "token" field — this will work
    const user = await User.findOne({ token: token });

    if (!user) return res.status(401).json({ message: "Invalid token" });

    const comment = await Comment.create({ postId, body, userId: user._id });
    const populated = await comment.populate("userId", "name username profilePicture");

    res.status(201).json(populated);
  } catch (err) {
    console.error("❌ CREATE COMMENT ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
};