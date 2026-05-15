// import User from "../models/user.model.js";
// import Profile from "../models/profile.model.js";
// import bcrypt from "bcrypt";
// import crypto from "crypto";
// import PDFDocument from "pdfkit";
// import fs from 'fs';


// const convertUserDataTOPDF = async (userData) => {
//   const doc = new PDFDocument();
//   const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
//   console.log("Generated file:", outputPath);
//   const stream = fs.createWriteStream("uploads/" + outputPath);

//   doc.pipe(stream);

//   // Profile picture
//   const picPath = `uploads/${userData.userId.profilePicture}`;
//   if (userData.userId.profilePicture && fs.existsSync(picPath)) {
//     doc.image(picPath, { align: "center", width: 100, height: 100 });
//     doc.moveDown();
//   }

//   // User info
//   doc.fontSize(18).text("Resume", { align: "center" });
//   doc.moveDown();
//   doc.fontSize(14).text(`Name: ${userData.userId.name}`);
//   doc.fontSize(14).text(`Username: ${userData.userId.username}`);
//   doc.fontSize(14).text(`Email: ${userData.userId.email}`);
//   doc.fontSize(14).text(`Bio: ${userData.bio || "N/A"}`);
//   doc.fontSize(14).text(`Current Post: ${userData.currentPost || "N/A"}`);
//   doc.moveDown();

  
//   const pastWork = userData.pastwork ?? userData.pastWork ?? [];
//   if (pastWork.length > 0) {
//     doc.fontSize(14).text("Past Work:");
//     pastWork.forEach((work) => {
//       doc.fontSize(12).text(`  Company: ${work.companyName || "N/A"}`);
//       doc.fontSize(12).text(`  Position: ${work.position || "N/A"}`);
//       doc.fontSize(12).text(`  Duration: ${work.duration || "N/A"}`);
//       doc.moveDown(0.5);
//     });
//   }

  
//   const education = userData.education ?? [];
//   if (education.length > 0) {
//     doc.moveDown();
//     doc.fontSize(14).text("Education:");
//     education.forEach((edu) => {
//       doc.fontSize(12).text(`  School: ${edu.school || "N/A"}`);
//       doc.fontSize(12).text(`  Degree: ${edu.degree || "N/A"}`);
//       doc.fontSize(12).text(`  Field of Study: ${edu.fieldOfStudy || "N/A"}`);
//       doc.moveDown(0.5);
//     });
//   }

//   doc.end();

//   await new Promise((resolve, reject) => {
//     stream.on("finish", resolve);
//     stream.on("error", reject);
//   });

//   return outputPath;
// };


// export const register = async (req, res) => {
//   try {
//     const { name, email, password, username } = req.body;

//     if (!name || !email || !password || !username)
//       return res.status(400).json({ message: "All fields are required" });

//     const user = await User.findOne({ email });
//     if (user) return res.status(400).json({ message: "User already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ name, email, password: hashedPassword, username });
//     await newUser.save();

//     const profile = new Profile({ userId: newUser._id });
//     await profile.save();

//     return res.json({ message: "User registered successfully" });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password)
//       return res.status(400).json({ message: "All fields are required" });

//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User does not exist" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

//     const token = crypto.randomBytes(32).toString("hex");
//     await User.updateOne({ _id: user._id }, { token });

//     return res.json({ token : token });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

// export const uploadProfilePicture = async (req, res) => {
//   const { token } = req.body;
//   try {
//     const user = await User.findOne({ token });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     user.profilePicture = req.file.filename;
//     await user.save();

//     return res.json({ message: "Profile picture updated successfully" });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

// export const updateUserprofile = async (req, res) => {
//   try {
    
//     const { token, ...newUserData } = req.body;
//     const user = await User.findOne({ token });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const { username, email } = newUserData;

//     const existingUser = await User.findOne({ $or: [{ username }, { email }] });
//     if (existingUser) {
      
//       if (String(existingUser._id) !== String(user._id)) {
//         return res.status(400).json({ message: "User already exists" });
//       }
//     }

//     Object.assign(user, newUserData);
//     await user.save();

//     return res.json({ message: "User Updated" });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

// export const getUserAndProfile = async (req, res) => {
//   try {
//     const { token } = req.body;
//     const user = await User.findOne({ token });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const userProfile = await Profile.findOne({ userId: user._id }).populate(
//       "userId",
//       "name username email profilePicture"
//     );
//     return res.json(userProfile);
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

// export const updateProfileData = async (req, res) => {
//   try {
//     const { token, ...newProfileData } = req.body;
//     const userProfile = await User.findOne({ token });
//     if (!userProfile) return res.status(404).json({ message: "User not found" });

//     const profile_to_update = await Profile.findOne({ userId: userProfile._id });
//     Object.assign(profile_to_update, newProfileData);
//     await profile_to_update.save();

//     return res.json({ message: "Profile updated" });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

// export const getAllUserProfile = async (req, res) => {
//   try {
//     const profiles = await Profile.find().populate(
//       "userId",
//       "name username email profilePicture"
//     );
//     return res.json({ profiles });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

// export const downloadProfile = async (req, res) => {
//   try {
//     const user_id = req.query.id;

    
//     const userProfile = await Profile.findOne({ userId: user_id }).populate(
//       "userId",
//       "name username email profilePicture"
//     );

    
//     if (!userProfile) {
//       return res.status(404).json({ message: "Profile not found" });
//     }
//     const fileName = await convertUserDataTOPDF(userProfile);
//     console.log("Downloading file:", fileName);
//     const filePath = `uploads/${fileName}`;

//     return res.download(filePath);


//     // const outputPath = await convertUserDataTOPDF(userProfile);
//     // return res.json({ message: outputPath });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

// export const sendConnectionRequest = async (req,res)=>{

//   const { token, connectionId } = req.body;

//   try {
//     const user = await User.findOne({ token });

//     if (!user) return res.status(404).json({ message: "User not found" });

//     const connectionUser = await User.findOne({_id: connectionId});
//     if(!connectionUser) return res.status(404).json({message:"Connection user not found"});

//     const existingRequest = await sendConnectionRequest.findOne(
//       {
//         userId: user._id,
//         connectionId: connectionUser._id
//       }
//     );

//     if(existingRequest) {
//       return res.status(400).json({message:"Request already sent"});
//     }

//     const request = new sendConnectionRequest({
//       userId: user._id,
//       connectionId: connectionUser._id
//     });

//     await request.save();
//     return res.json({message:"Request sent"})

//   } catch (error) {
//     return res.status(500).json({message:error.message});
//   }
// }

// export const getMyConnectionRequests = async (req,res)=>{
//   const { token } = req.body;

//   try {

//     const user = await User.findOne({ token });

//     if (!user) return res.status(404).json({ message: "User not found" });

//     const connections = await ConnectionRequests.find({ userId: user._id}).populate("connectionId","name username email profilePicture");

//     return res.json({connections});

//   } catch (error) {
//     return res.status(500).json({message:error.message});
//   }
// }

// export const whatAreMyConnections = async (req,res) =>{
//   const { token }= req.body;

//   try {

//     const user= await User.findOne({ token });

//     if(!user) return res.status(404).json({message: "User not found"});

//     const connections = await Connection.find({connectionId: user._id}).populate("userId","name username email profilePicture");
//     return res.json({connections});

//   } catch (error) {
//     return res.status(500).json({message:error.message});
//   }
// }

// export const acceptConnectionRequest = async (req,res)=>{

//   const {token, requestId,action_type} = req.body;

//   try {

//     const user = await User.findOne({ token });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const connection = await ConnectionRequest.findOne({_id: requestId});
//     if(!connection) return res.status(404).json({message:"Connection request not found"});

//     if (action_type === "accept") {
//       connection.status_accepted= true;
//     } else {
//       connection.status_accepted = false;
//     }
//     await connection.save();
//     return res.json({message:"Request updated"});
    
//   } catch (error) {
//     return res.status(500).json({message:error.message});
//   }
// }

// export const commentPost = async (req,res)=> {


//   const {token,post_id,commentBody} = req.body;
//   try {
//     const user = await User.findOne({token: token}).select("_id");

//     if(!user) {
//       return res.status(404).json({message: "User not found"});
//     }

//     const post = await Post.findOne({_id: post_id});
//     if(!post) {
//       return res.status(404).json({message: "Post not found"});
//     }

//     const comment = new Comment ({
//       userId: user._id,
//       postId: post._id,
//       comment: commentBody
//     });

//     await comment.save();
//     return res.status(200).json({message:"Comment added"});

//   } catch (error) {
//     return res.status(500).json({message:error.message});
//   }
// }



import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import ConnectionRequest from "../models/connection.model.js";
import Connection from "../models/connection.model.js";
import Post from "../models/posts.model.js";
import Comment from "../models/comments.model.js";

import bcrypt from "bcrypt";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";


// -------------------- PDF GENERATOR --------------------
const convertUserDataTOPDF = async (userData) => {
  const doc = new PDFDocument();

  const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
  const fullPath = path.join("uploads", outputPath);

  console.log("Generated file:", fullPath);

  const stream = fs.createWriteStream(fullPath);
  doc.pipe(stream);

  // Profile picture
  const picPath = `uploads/${userData.userId?.profilePicture}`;
  if (userData.userId?.profilePicture && fs.existsSync(picPath)) {
    doc.image(picPath, { align: "center", width: 100, height: 100 });
    doc.moveDown();
  }

  // User Info
  doc.fontSize(18).text("Resume", { align: "center" });
  doc.moveDown();

  doc.fontSize(14).text(`Name: ${userData.userId?.name || "N/A"}`);
  doc.fontSize(14).text(`Username: ${userData.userId?.username || "N/A"}`);
  doc.fontSize(14).text(`Email: ${userData.userId?.email || "N/A"}`);
  doc.fontSize(14).text(`Bio: ${userData.bio || "N/A"}`);
  doc.fontSize(14).text(`Current Post: ${userData.currentPost || "N/A"}`);

  doc.moveDown();

  // Past Work
  const pastWork = userData.pastwork ?? userData.pastWork ?? [];
  if (pastWork.length > 0) {
    doc.fontSize(14).text("Past Work:");
    pastWork.forEach((work) => {
      doc.fontSize(12).text(`Company: ${work.companyName || "N/A"}`);
      doc.fontSize(12).text(`Position: ${work.position || "N/A"}`);
      doc.fontSize(12).text(`Duration: ${work.duration || "N/A"}`);
      doc.moveDown(0.5);
    });
  }

  // Education
  const education = userData.education ?? [];
  if (education.length > 0) {
    doc.moveDown();
    doc.fontSize(14).text("Education:");
    education.forEach((edu) => {
      doc.fontSize(12).text(`School: ${edu.school || "N/A"}`);
      doc.fontSize(12).text(`Degree: ${edu.degree || "N/A"}`);
      doc.fontSize(12).text(`Field: ${edu.fieldOfStudy || "N/A"}`);
      doc.moveDown(0.5);
    });
  }

  doc.end();

  await new Promise((resolve, reject) => {
    stream.on("finish", resolve);
    stream.on("error", reject);
  });

  return outputPath;
};


// -------------------- REGISTER --------------------
export const register = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;

    if (!name || !email || !password || !username) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      username,
    });
    console.log("BODY RECEIVED:", req.body);

    await newUser.save();

    const profile = new Profile({ userId: newUser._id });
    await profile.save();

    return res.json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// -------------------- LOGIN --------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    await User.updateOne({ _id: user._id }, { token });

    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// -------------------- CONNECTION REQUEST --------------------
export const sendConnectionRequest = async (req, res) => {
  const { token, connectionId } = req.body;

  try {
    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "User not found" });

    const connectionUser = await User.findById(connectionId);
    if (!connectionUser) {
      return res.status(404).json({ message: "Connection user not found" });
    }

    const existingRequest = await ConnectionRequest.findOne({
      userId: user._id,
      connectionId: connectionUser._id,
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Request already sent" });
    }

    const request = new ConnectionRequest({
      userId: user._id,
      connectionId: connectionUser._id,
    });

    await request.save();

    return res.json({ message: "Request sent" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// whatAreMyConnections
export const whatAreMyConnections = async (req,res) =>{
  const { token }= req.body;

  try {

    const user= await User.findOne({ token });

    if(!user) return res.status(404).json({message: "User not found"});

    const connections = await Connection.find({connectionId: user._id}).populate("userId","name username email profilePicture");
    return res.json({connections});

  } catch (error) {
    return res.status(500).json({message:error.message});
  }
}

// uploadProfilePicture
export const uploadProfilePicture = async (req, res) => {
  const { token } = req.body;
  try {
    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.profilePicture = req.file.filename;
    await user.save();

    return res.json({ message: "Profile picture updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// updateUserProfile
export const updateUserprofile = async (req, res) => {
  try {
    
    const { token, ...newUserData } = req.body;
    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "User not found" });

    const { username, email } = newUserData;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      
      if (String(existingUser._id) !== String(user._id)) {
        return res.status(400).json({ message: "User already exists" });
      }
    }

    Object.assign(user, newUserData);
    await user.save();

    return res.json({ message: "User Updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// updateProfileData
export const updateProfileData = async (req, res) => {
  try {
    const { token, ...newProfileData } = req.body;
    const userProfile = await User.findOne({ token });
    if (!userProfile) return res.status(404).json({ message: "User not found" });

    const profile_to_update = await Profile.findOne({ userId: userProfile._id });
    Object.assign(profile_to_update, newProfileData);
    await profile_to_update.save();

    return res.json({ message: "Profile updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// getalluserprofile
export const getAllUserProfile = async (req, res) => {
  try {
    const profiles = await Profile.find().populate(
      "userId",
      "name username email profilePicture"
    );
    return res.json({ profiles });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// -------------------- GET CONNECTION REQUESTS --------------------
export const getMyConnectionRequests = async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "User not found" });

    const connections = await ConnectionRequest.find({
      userId: user._id,
    }).populate("connectionId", "name username email profilePicture");

    return res.json({ connections });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// getUserAndProfile
export const getUserAndProfile = async (req, res) => {
  try {
    const { token } = req.query;
    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "User not found" });

    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name username email profilePicture"
    );
    return res.json(userProfile);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// download profile
export const downloadProfile = async (req, res) => {
  try {
    const user_id = req.query.id;

    
    const userProfile = await Profile.findOne({ userId: user_id }).populate(
      "userId",
      "name username email profilePicture"
    );

    
    if (!userProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    const fileName = await convertUserDataTOPDF(userProfile);
    console.log("Downloading file:", fileName);
    const filePath = `uploads/${fileName}`;

    return res.download(filePath);


    // const outputPath = await convertUserDataTOPDF(userProfile);
    // return res.json({ message: outputPath });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// -------------------- ACCEPT REQUEST --------------------
export const acceptConnectionRequest = async (req, res) => {
  const { token, requestId, action_type } = req.body;

  try {
    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "User not found" });

    const request = await ConnectionRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    if (action_type === "accept") {
      request.status_accepted = true;
    } else {
      request.status_accepted = false;
    }

    await request.save();

    return res.json({ message: "Request updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// -------------------- COMMENT POST --------------------
export const commentPost = async (req, res) => {
  const { token, post_id, commentBody } = req.body;

  try {
    const user = await User.findOne({ token }).select("_id");
    if (!user) return res.status(404).json({ message: "User not found" });

    const post = await Post.findById(post_id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = new Comment({
      userId: user._id,
      postId: post._id,
      comment: commentBody,
    });

    await comment.save();

    return res.json({ message: "Comment added" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};