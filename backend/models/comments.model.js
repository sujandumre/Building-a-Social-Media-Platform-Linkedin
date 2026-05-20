// import mongoose from "mongoose";

// const CommentSchema =  new mongoose.Schema({
//   userId:{
//     type:mongoose.Schema.Types.ObjectId,
//     ref:"User",
    
//   },
//   postId:{
//     type:mongoose.Schema.Types.ObjectId,
//     ref:"Post",
//   },
//   body:{
//     type:String,
//     required:true
//   }
// });

// const Comment = mongoose.model("Comment",CommentSchema);


// export default Comment;

import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  body:   { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Comment", commentSchema);