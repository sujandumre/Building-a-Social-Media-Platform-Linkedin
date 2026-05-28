

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



const convertUserDataTOPDF = async (userData) => {
  const doc = new PDFDocument();

  const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
  const fullPath = path.join("uploads", outputPath);

  console.log("Generated file:", fullPath);

  if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads", { recursive: true });
  }

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

 
  const pastWork = userData.pastwork ?? [];
if (pastWork.length > 0) {
  doc.moveDown();
  doc.fontSize(14).text("Past Work:");
  pastWork.forEach((work) => {
    doc.fontSize(12).text(`  Company: ${work.company || "N/A"}`);   
    doc.fontSize(12).text(`  Position: ${work.position || "N/A"}`); 
    doc.fontSize(12).text(`  Years: ${work.years || "N/A"}`);       
    doc.moveDown(0.5);
  });
}



  const education = userData.education ?? [];
if (education.length > 0) {
  doc.moveDown();
  doc.fontSize(14).text("Education:");
  education.forEach((edu) => {
    doc.fontSize(12).text(`  School: ${edu.school || "N/A"}`);           
    doc.fontSize(12).text(`  Degree: ${edu.degree || "N/A"}`);          
    doc.fontSize(12).text(`  Field: ${edu.fieldOfStudy || "N/A"}`);     
    doc.moveDown(0.5);
  });
}

 
  await new Promise((resolve, reject) => {
    stream.on("finish", resolve);
    stream.on("error", reject);
    doc.end(); 
  });

  return outputPath;
};



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



// whatAreMyConnections
export const whatAreMyConnections = async (req,res) =>{
  const { token }= req.query;

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


export const updateProfileData = async (req, res) => {
  try {
    const { token, bio, currentPost, pastWork, education } = req.body;
    
    console.log("1. Request body:", req.body);        
    console.log("2. pastWork received:", pastWork);   

    const userProfile = await User.findOne({ token });
    console.log("3. User found:", userProfile?._id);  

    if (!userProfile) return res.status(404).json({ message: "User not found" });

    const profile_to_update = await Profile.findOne({ userId: userProfile._id });
    console.log("4. Profile found:", profile_to_update); 

    if (!profile_to_update) return res.status(404).json({ message: "Profile not found" });

    if (bio !== undefined) profile_to_update.bio = bio;
    if (currentPost !== undefined) profile_to_update.currentPost = currentPost;

    if (pastWork !== undefined) {
      profile_to_update.pastwork = pastWork.map((work) => ({
        company: work.company,
        position: work.position,
        years: work.duration ?? work.years,
      }));
    }

    if (education !== undefined) {
      profile_to_update.education = education.map((edu) => ({
        school: edu.institution ?? edu.school,
        degree: edu.degree,
        fieldOfStudy: edu.fieldOfStudy ?? "",
      }));
    }

    await profile_to_update.save();
    console.log("5. Saved pastwork:", profile_to_update.pastwork); 

    return res.json({ message: "Profile updated" });
  } catch (error) {
    console.error("Error:", error);
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



export const getMyConnectionRequests = async (req, res) => {
  const { token } = req.query;
  try {
    const user = await User.findOne({ token })
      .populate("connectionRequests.received", "name username email profilePicture");
    
    if (!user) return res.status(404).json({ message: "User not found" });
    console.log("Received requests:", user.connectionRequests.received);
    return res.json({ connections: user.connectionRequests.received });
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




export const downloadProfile = async (req, res) => {
  try {
    const user_id = req.query.id;

    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const userProfile = await Profile.findOne({ userId: user_id }).populate(
      "userId",
      "name username email profilePicture"
    );

    if (!userProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const fileName = await convertUserDataTOPDF(userProfile);
    console.log("Downloading file:", fileName);

    const filePath = path.join("uploads", fileName);
    return res.download(filePath, "resume.pdf", (err) => {
      if (err) {
        console.error("Download error:", err);
        return res.status(500).json({ message: "Failed to send file" });
      }
    });

  } catch (error) {
    console.error("downloadProfile error:", error);
    return res.status(500).json({ message: error.message });
  }
};


export const acceptConnectionRequest = async (req, res) => {
  const { token, connection_id, action_type } = req.body;

  try {
    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "User not found" });

    await User.findByIdAndUpdate(user._id, {
      $pull: { "connectionRequests.received": connection_id },
      $addToSet: { connections: connection_id }
    });

    await User.findByIdAndUpdate(connection_id, {
      $pull: { "connectionRequests.sent": user._id },
      $addToSet: { connections: user._id }
    });

    return res.json({ message: "Connection accepted" });
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
      body: commentBody,
    });

    await comment.save();

    return res.json({ message: "Comment added" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUserProfileAndUserbasedOnUsername = async (req, res) => {
  const { username } = req.query;

  try {
    const user = await User.findOne({
      username
    });
    if (!user) {
      return res.status(404).json({message:"User not found"})
    }
    const userProfile = await Profile.findOne({userId: user._id }).populate('userId', 'name username email profilePicture');
    return res.json({"profile" : userProfile })
  } catch (error ) {
    return res.status(500).json({message: error.message})
  }
}



export const getConnectionRequests = async (req, res) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({ token }).populate(
      "connections",
      "name username email profilePicture"
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    console.log("My connections:", user.connections); 

    return res.status(200).json({ connections: user.connections });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};