import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import React, {useEffect, useState } from "react";
import styles from "./index.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getAboutUser} from "./../../redux/action/authAction";
import { BASE_URL, clientServer } from "@/config";
import { useRouter } from "next/router";
import { getAllPosts } from "@/redux/action/postAction";
 

export default function ProfilePage() {

  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  const [userProfile, setUserProfile] = useState({});
  const dispatch = useDispatch();
  const [userPosts, setUserPosts] = useState([]);
   const postReducer = useSelector((state) => state.post);


  
  useEffect(()=> {
    dispatch(getAboutUser({ token: localStorage.getItem("token") }))
    dispatch(getAllPosts());
  }, [])

  useEffect(()=> {
    setUserProfile(authState?.user);
  }, [authState.user])

   useEffect(() => {
      if (!router.isReady || !postReducer?.posts?.length) return;
      const profileUsername = userProfile?.userId?.username;
      console.log("profileUsername:", profileUsername);
      const filteredPosts = postReducer.posts.filter(
        (post) => post?.userId?.username === profileUsername,
      );
      setUserPosts(filteredPosts);
    }, [postReducer?.posts, router.isReady, userProfile]);


    const updateProfilePicture = async (file) => {
      const formData = new FormData();
      formData.append("profile_picture", file);
      formData.append("token", localStorage.getItem("token"));

      const response = await clientServer.post("/update_profile_picture", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    }

    // const updateProfileData = async () => {
    //   const request = await clientServer.post("/user_update", {
    //     token: localStorage.getItem("token"),
    //     name: userProfile.userId.name,
    //   });
    //   const response = await clientServer.post("/update_profile_date",{
    //     token: localStorage.getItem("token"),
    //     bio:userProfile?.bio,
    //     currentPost:userProfile?.currentPost,
    //     pastWork:userProfile?.pastwork,
    //     education:userProfile?.education
    //   });
    //   dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    // }

    const updateProfileData = async () => {
  try {
    await clientServer.post("/user_update", {
      token: localStorage.getItem("token"),
      name: userProfile.userId.name,
    });

    await clientServer.post("/update_profile_data", {
      token: localStorage.getItem("token"),
      bio: userProfile.bio,
      currentPost: userProfile.currentPost,
      pastWork: userProfile.pastwork,
      education: userProfile.education
    });

    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    alert("Profile updated successfully!");

  } catch (err) {
    console.error("Update failed:", err.response?.data || err.message);
    alert("Failed to update profile.");
  }
}
  return (
    <UserLayout>
      <DashboardLayout>
        { authState.user && userProfile.userId &&
        <div className={styles.container}>
          
          <div className={styles.backDropContainer}>
  <div className={styles.backDrop_overlay}>
    <img
      src={`${BASE_URL}/uploads/${userProfile?.userId?.profilePicture}`}
      alt="profile"
    />
    <label  htmlFor="profilePictureUpload" className={styles.editOverlay}>
      <p>Edit</p>
    </label>
    <input onChange={(e) => updateProfilePicture(e.target.files[0])} hidden type="file" id="profilePictureUpload" style={{ display: "none" }} />
  </div>
</div>
      
    
          <div className={styles.profileContainer_details}>
            <div style={{ display: "flex", gap: "0.7rem" }}>
              <div style={{ flex: "0.8" }}>
                <div
                  style={{
                    display: "flex",
                    width: "fit-content",
                    alignItems: "center",
                    gap: "1.2rem",
                  }}
                >
                  {/* <h2>{userProfile?.userId?.name}</h2> */}
                  <input className={styles.nameEdit} type="text" value={userProfile?.userId?.name} onChange={(e) => {
                    setUserProfile({ ...userProfile, userId: { ...userProfile.userId, name: e.target.value } })
                  }} />
                  <p style={{ color: "gray" }}>
                    @{userProfile?.userId?.username}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.2rem",
                  }}
                >
                  
                </div>

                <div>
                  <p>{userProfile.bio}</p>
                </div>
              </div>

              <div style={{ flex: "0.2" }}>
                <h3>Recent Activity</h3>
                {userPosts.map((post) => {
                  return (
                    <div key={post._id} className={styles.postCard}>
                      <div className={styles.card}>
                        <div className={styles.card_profileContainer}>
                          {post.media !== "" ? (
                            <img
                              src={`${BASE_URL}/uploads/${post.media}`}
                              alt=""
                            />
                          ) : (
                            <div
                              style={{ width: "3.4rem", height: "3.4rem" }}
                            ></div>
                          )}
                        </div>
                        <p>{post.body}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="workHistory">
            <h4>Work History</h4>
            <div className={styles.workHistoryContainer}>
             
              {userProfile.pastwork?.length > 0 ? (
                userProfile.pastwork.map((work, index) => (
                  <div key={index} className={styles.workHistoryCard}>
                    <p
                      style={{
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.8rem",
                      }}
                    >
                      {work.company} - {work.position}
                    </p>
                    <p>{work.years}</p>
                  </div>
                ))
              ) : (
                <p>No work history found</p> // ← tells you if array is empty vs undefined
              )}
            </div>
          </div>
          {userProfile != authState.user && 
          <div onClick={updateProfileData} className={styles.updateProfileBtn}>
            Update Profile
          </div>
          }
        </div>
        }
      </DashboardLayout>
    </UserLayout>
  );
}

