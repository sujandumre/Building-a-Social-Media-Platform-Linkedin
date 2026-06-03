

import styles from "./index.module.css";
import React, { useEffect } from 'react'
import UserLayout from '@/layout/UserLayout'
import DashboardLayout from '@/layout/DashboardLayout'
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '@/redux/action/authAction';
import { BASE_URL } from '@/config'; 
import { useRouter } from "next/router";

export default function SearchPage() {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();


  const getProfilePic = (pic) => {
  if (!pic || pic === "default.jpg") return "/default-avatar.png";
  if (pic?.startsWith("http")) return pic;
  if (pic?.startsWith("linkedin-clone/")) {
    return `https://res.cloudinary.com/dcbdckji6/image/upload/${pic}`;
  }
  return `${BASE_URL}/uploads/${pic}`;
};

  useEffect(() => {
    dispatch(getAllUsers()); 
  }, []);

  const router = useRouter();

  
  console.log("all_users:", authState.all_users);
  console.log("all_profiles_fetched:", authState.all_profiles_fetched);

  return (
    <UserLayout>
      <DashboardLayout>
        <h1>Search</h1>
        <div className={styles.allUserProfile}>
         
          {(authState.all_users || []).map((profile) => (
            <div 
            onClick={() => router.push(`/view_profile/${profile.userId?.username}`)} 
             key={profile._id} className={styles.userProfile}>
              <img
                src={
                  profile.userId?.profilePicture
                    ? `${BASE_URL}/uploads/${profile.userId.profilePicture}`
                    : "/default1.png"
                }
                alt="profile"
              />
              {/* <img src={getProfilePic(profile?.profile_pic)} alt="" /> */}
              <h1>{profile.userId?.name}</h1>
              
              <p>@{profile.userId?.username}</p>
            </div>
          ))}

      
          {authState.all_users?.length === 0 && (
            <p>No users found.</p>
          )}
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}