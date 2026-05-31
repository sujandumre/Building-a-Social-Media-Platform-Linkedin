import { Router } from "express";
import { login, register } from "../controllers/user.controller.js";
import multer from "multer";
import jwt from "jsonwebtoken";
import { uploadProfilePicture,updateUserprofile,getUserAndProfile,updateProfileData,getAllUserProfile , acceptConnectionRequest, whatAreMyConnections, getMyConnectionRequests, downloadProfile, googleLogin,getConnectionRequests , getUserProfileAndUserbasedOnUsername  } from "../controllers/user.controller.js";
import { storage } from "../config/cloudinary.js";

const upload = multer({ storage });
const router = Router();
router.post("/login", login);
router.post("/register", register);


const upload = multer({ storage });




router.route('/update_profile_picture')
.post(upload.single("profile_picture"), uploadProfilePicture);

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/user_update').post(updateUserprofile);
router.route('/get_user_and_profile').get(getUserAndProfile);
router.route('/update_profile_data').post(updateProfileData);
router.post("/google-login", googleLogin);
router.route('/user/get_all_users').get(getAllUserProfile);
router.route('/user/download_resume').get(downloadProfile);
router.route('/getMyConnectionRequests').get(getMyConnectionRequests);
router.route('/user_connection_request').get(whatAreMyConnections);
router.route('/accept_connection_request').post(acceptConnectionRequest);
router.route('/getConnectionRequests').get(getConnectionRequests);
router.route('/user/get_profile_based_on_username').get(getUserProfileAndUserbasedOnUsername);
export default router;

