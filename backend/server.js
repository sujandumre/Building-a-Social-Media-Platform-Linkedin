// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import mongoose from 'mongoose';
// import postRoutes from './routes/posts.routes.js';
// import userRoutes from './routes/user.routes.js';


// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use(postRoutes);
// app.use(userRoutes);
// // app.use(express.static("uploads"));
// app.use("/uploads", express.static("uploads"));



// const start=async()=>{

//   const connectDB=await mongoose.connect("mongodb+srv://dumresuman02_db_user:5tdqvDjGjwbzxFps@linkedinclone.vah0xrr.mongodb.net/?appName=linkedinclone");
//   app.listen(9090,()=>{
//     console.log("Server is running on port 9090");
//   })

// }
// start();


import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import postRoutes from './routes/posts.routes.js';
import userRoutes from './routes/user.routes.js';


dotenv.config();

const app = express();

// ✅ Single correct CORS config — remove the old app.use(cors()) above
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.options("*", cors()); // ✅ handle preflight

app.use(express.json());
app.use(postRoutes);
app.use(userRoutes);
app.use("/uploads", express.static("uploads"));

const start = async () => {
  await mongoose.connect("mongodb+srv://dumresuman02_db_user:5tdqvDjGjwbzxFps@linkedinclone.vah0xrr.mongodb.net/?appName=linkedinclone");
  app.listen(9090, () => {
    console.log("Server is running on port 9090");
  });
};

start();