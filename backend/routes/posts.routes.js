import { Router } from "express";
import { activeCheck, createPost, getAllPosts,deletePost,increment_likes, delete_comment_of_user, get_comments_by_post } from "../controllers/posts.controller.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();



app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Multer storage config
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/"); // make sure this folder exists
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + ".jpg"); // or original name logic
  }
});

export const upload = multer({ storage });


const uploadPath = "uploads/";

// create folder if not exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}
// const upload = multer({ storage: storage });

// Routes
router.get("/", activeCheck);

// Create post (with file upload)
router.post("/post", upload.single("media"), (req, res, next) => {
  console.log("Uploaded file:", req.file); // debug
  next(); // pass to controller
}, createPost);



// Get posts
router.get("/post", getAllPosts);
// router.route("/posts").get(getAllPosts);

router.route("/delete_post").post(deletePost);
// router.route("/comment").post(commentPost);
router.route("/get_comments").post(get_comments_by_post);
router.route("/delete_comment").post(delete_comment_of_user);
router.route("/increment_post_likes").post(increment_likes);


export default router;
