import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getAboutUser } from "./../../redux/action/authAction";
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
  const postState = useSelector((state) => state.post);
  const [IsModelOpen, setIsModelOpen] = useState(false);
  const [isEduModelOpen, setIsEduModelOpen] = useState(false);
  const [inputData, setInputData] = useState({
    company: "",
    position: "",
    years: "",
  });

  const [inputEduData, setInputEduData] = useState({
    institution: "",
    degree: "",
    duration: "",
  });

 

//   const getProfilePic = (pic) => {
//   if (!pic || pic === "default.jpg") return "/default-avatar.png";
//   if (pic?.startsWith("http")) return pic; // ← full URL
//   if (pic?.startsWith("linkedin-clone/")) { // ← Cloudinary public ID
//     return `https://res.cloudinary.com/dcbdckji6/image/upload/${pic}`;
//   }
//   return `${BASE_URL}/uploads/${pic}`; // ← local upload
// };

const getProfilePic = (pic) => {
  if (!pic || pic === "default.jpg" || pic === "profile" || pic === "") 
    return "/default-avatar.png"; // ← add "profile" check
  if (pic?.startsWith("http")) return pic;
  if (pic?.startsWith("linkedin-clone/")) {
    return `https://res.cloudinary.com/dcbdckji6/image/upload/${pic}`;
  }
  return `${BASE_URL}/uploads/${pic}`;
};

  const handleWorkInputChange = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
  };

  const handleEducationInputChange = (e) => {
    const { name, value } = e.target;
    setInputEduData({ ...inputEduData, [name]: value });
  };

  useEffect(() => {
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    dispatch(getAllPosts());
  }, []);

  useEffect(() => {
    setUserProfile(authState?.user);
  }, [authState.user]);

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

    const response = await clientServer.post(
      "/update_profile_picture",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  };

  const updateProfileData = async () => {
    try {
      await clientServer.post("/user_update", {
        token: localStorage.getItem("token"),
        name: userProfile.userId?.name,
      });

      await clientServer.post("/update_profile_data", {
        token: localStorage.getItem("token"),
        bio: userProfile.bio,
        currentPost: userProfile.currentPost,
        pastWork: userProfile.pastwork,
        education: userProfile.education,
      });

      dispatch(getAboutUser());
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      alert("Failed to update profile.");
    }
  };

  return (
    <UserLayout>
      <DashboardLayout>
        {authState.user && userProfile.userId && (
          <div className={styles.container}>
            <div className={styles.backDropContainer}>
              <div className={styles.backDrop_overlay}>
                <img
                  src={getProfilePic(userProfile?.userId?.profilePicture)}
                  alt="profile"
                />
                <label
                  htmlFor="profilePictureUpload"
                  className={styles.editOverlay}
                >
                  <p>Edit</p>
                </label>
                <input
                  onChange={(e) => updateProfilePicture(e.target.files[0])}
                  hidden
                  type="file"
                  id="profilePictureUpload"
                  style={{ display: "none" }}
                />
              </div>
            </div>

            <div className={styles.profileContainer_details}>
              <div style={{ display: "flex", gap: "0.7rem", flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 60%" }}>
                  <div
                    style={{
                      display: "flex",
                      width: "fit-content",
                      alignItems: "center",
                      gap: "1.2rem",
                    }}
                  >
                    <input
                      className={styles.nameEdit}
                      type="text"
                      value={userProfile?.userId?.name}
                      onChange={(e) => {
                        setUserProfile({
                          ...userProfile,
                          userId: {
                            ...userProfile.userId,
                            name: e.target.value,
                          },
                        });
                      }}
                    />
                   
                    <input
                      type="text"
                      value={userProfile?.userId?.username || ""}
                      onChange={(e) => {
                        setUserProfile({
                          ...userProfile,
                          userId: {
                            ...userProfile.userId,
                            username: e.target.value,
                          },
                        });
                      }}
                      style={{ color: "gray", border: "none", outline: "none" }}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1.2rem",
                    }}
                  ></div>

                  <div>
                    <textarea
                      value={userProfile.bio}
                      onChange={(e) => {
                        setUserProfile({ ...userProfile, bio: e.target.value });
                      }}
                      rows={Math.max(3, Math.ceil(userProfile.bio.length / 80))}
                      style={{ width: "100%" }}
                    />
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
                                src={
                                  post.media?.startsWith("http")
                                    ? post.media
                                    : `${BASE_URL}/uploads/${post.media}`
                                }
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
                  <p>No work history found</p>
                )}
              </div>
              <button
                className={styles.addWorkButton}
                onClick={() => {
                  setIsModelOpen(true);
                }}
              >
                Add Work
              </button>
            </div>
            {userProfile != authState.user && (
              <div
                onClick={updateProfileData}
                className={styles.updateProfileBtn}
              >
                Update Profile
              </div>
            )}
           

            {IsModelOpen && (
              <div
                onClick={() => {
                  setIsModelOpen(false);
                }}
                className={styles.commitContainer}
              >
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className={styles.allCommentsContainer}
                >
                  <input
                    onChange={handleWorkInputChange}
                    name="company"
                    className={styles.inputField}
                    type="text"
                    placeholder="Enter Company"
                  />
                  <input
                    onChange={handleWorkInputChange}
                    name="position"
                    className={styles.inputField}
                    type="text"
                    placeholder="Enter Position"
                  />
                  <input
                    onChange={handleWorkInputChange}
                    name="years"
                    className={styles.inputField}
                    type="number"
                    placeholder="years worked"
                  />
                  <div
                    onClick={() => {
                      setUserProfile({
                        ...userProfile,
                        pastwork: [...userProfile.pastwork, inputData],
                      });
                      setIsModelOpen(false);
                    }}
                    className={styles.updateProfileBtn}
                  >
                    Add Work
                  </div>
                </div>
              </div>
            )}

            

            <div className="educationHistory">
  <h4>Education</h4>
  <div className={styles.EduHistoryContainer}>
    {userProfile.education?.filter(
      (edu) => edu.institution || edu.degree || edu.duration,
    ).length > 0 ? (
      userProfile.education
        .filter((edu) => edu.institution || edu.degree || edu.duration)
        .map((edu, index) => (
          <div key={index} className={styles.EduHistoryCard}>
            <p style={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.8rem" }}>
              {edu.institution}
              {edu.institution && edu.degree ? " - " : ""}
              {edu.degree}
            </p>
            <p>{edu.duration}</p>
          </div>
        ))
    ) : (
      <p>No education found</p>
    )}
  </div>

  <button
    className={styles.addEduButton}
    onClick={() => setIsEduModelOpen(true)}
  >
    Add Education
  </button>

  {userProfile != authState.user && (
    <div onClick={updateProfileData} className={styles.updateProfileBtn}>
      Update Profile
    </div>
  )}

 
  {isEduModelOpen && (
    <div className={styles.allCommentsContainer}>
      <input
        onChange={handleEducationInputChange}
        name="institution"
        className={styles.inputField}
        type="text"
        placeholder="Enter Institution"
        value={inputEduData.institution} 
      />
      <input
        onChange={handleEducationInputChange}
        name="degree"
        className={styles.inputField}
        type="text"
        placeholder="Enter Degree"
        value={inputEduData.degree} 
      />
      <input
        onChange={handleEducationInputChange}
        name="duration"
        className={styles.inputField}
        type="number"
        placeholder="Enter Duration"
        value={inputEduData.duration} 
      />

      <div
        onClick={() => {
          setUserProfile({
            ...userProfile,
            education: [...userProfile.education, inputEduData],
          });
         
          setInputEduData({ institution: "", degree: "", duration: "" });
          setIsEduModelOpen(false); 
        }}
        className={styles.updateProfileBtn}
      >
        Add Education
      </div>
    </div>
  )}
</div>
          </div>
        )}
      </DashboardLayout>
    </UserLayout>
  );
}
