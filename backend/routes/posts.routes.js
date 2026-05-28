import { Router } from "express";
import express from "express";
import { activeCheck, createPost, getAllPosts, deletePost, increment_likes, delete_comment_of_user, get_comments_by_post, create_comment, sendConnectionRequest} from "../controllers/posts.controller.js";
import multer from "multer";
import path from "path";
import fs from "fs";


const router = Router();
const app = express();



app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + ".jpg"); 
  }
});

export const upload = multer({ storage });


const uploadPath = "uploads/";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

router.get("/", activeCheck);


router.post("/post", upload.single("media"), (req, res, next) => {
  console.log("Uploaded file:", req.file);
  next(); 
}, createPost);



// Get posts
router.get("/post", getAllPosts);
router.route("/delete_post").delete(deletePost);
router.route("/comments").post(create_comment);
router.route("/get_comments").post(get_comments_by_post);
router.route("/delete_comment").post(delete_comment_of_user);
router.route("/increment_post_likes").post(increment_likes);
router.route('/user/send_connection_request').post(sendConnectionRequest);


export default router;

