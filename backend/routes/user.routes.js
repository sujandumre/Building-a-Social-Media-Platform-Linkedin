import { Router } from "express";
import { login, register } from "../controllers/user.controller.js";
import multer from "multer";
import jwt from "jsonwebtoken";
import { uploadProfilePicture,updateUserprofile,getUserAndProfile,updateProfileData,getAllUserProfile , acceptConnectionRequest, whatAreMyConnections, getMyConnectionRequests, downloadProfile,sendConnectionRequest, getUserProfileAndUserbasedOnUsername } from "../controllers/user.controller.js";


const router = Router();
router.post("/login", login);
router.post("/register", register);

const storage = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,"uploads/");

  },
  filename:(req,file,cb)=>{
    cb(null,file.originalname);
  }
})



const upload = multer({storage:storage});

router.route('/update_profile_picture')
.post(upload.single("profile_picture"), uploadProfilePicture);

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/user_update').post(updateUserprofile);
router.route('/get_user_and_profile').get(getUserAndProfile);
router.route('/update_profile_data').post(updateProfileData);

router.route('/user/get_all_users').get(getAllUserProfile);
router.route('/user/download_resume').get(downloadProfile);
router.route('/user/send_connection_request').post(sendConnectionRequest);
router.route('/user/getConnectionrequest').get(getMyConnectionRequests);
router.route('/user/user_connection_request').get(whatAreMyConnections);
router.route('/user/accept_connection_request').post(acceptConnectionRequest);
// router.route('/user/get_profile_based_on_username').get( UserProfileAndUserbasedOnUsername);

router.route('/user/get_profile_based_on_username').get(getUserProfileAndUserbasedOnUsername);
export default router;

