

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Router } from 'express';
import mongoose from 'mongoose';
import postRoutes from './routes/posts.routes.js';
import userRoutes from './routes/user.routes.js';


dotenv.config();

const app = express();


app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.options("*", cors());

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