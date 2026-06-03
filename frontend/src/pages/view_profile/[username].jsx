import { BASE_URL, clientServer } from "@/config";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getAllPosts } from "@/redux/action/postAction";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getConnectionsRequest,
  getMyconnectionRequests,
} from "@/redux/action/authAction";

import { sendConnectionRequest } from "@/redux/action/postAction";

export default function ViewProfilePage({ userProfile }) {
  const router = useRouter();
  const postReducer = useSelector((state) => state.post);
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [userPosts, setUserPosts] = useState([]);
  const [isCurrentUserInConnection, setIsCurrentUserInConnection] =
    useState(false);
  const [isConnectionNull, setConnectionNull] = useState(true);
  const searchParamers = useSearchParams();

  const getUsersPost = async () => {
    const token = localStorage.getItem("token");

    dispatch(getAllPosts());

    if (token) {
      dispatch(getConnectionsRequest({ token }));
      dispatch(getMyconnectionRequests({ token }));
    }
  };

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

  useEffect(() => {
    console.log("full redux state:", postReducer);
  }, [postReducer]);

  useEffect(() => {
    if (!router.isReady || !postReducer?.posts?.length) return;
    const profileUsername = userProfile?.userId?.username;
    console.log("profileUsername:", profileUsername);
    const filteredPosts = postReducer.posts.filter(
      (post) => post?.userId?.username === profileUsername,
    );
    setUserPosts(filteredPosts);
  }, [postReducer?.posts, router.isReady, userProfile]);

  useEffect(() => {
    if (!userProfile?.userId?._id || !authState?.connections) return;

    const targetId = userProfile.userId._id.toString();

    const found = authState.connections.find((user) => {
      return (
        user._id?.toString() === targetId ||
        user.connection?._id?.toString() === targetId ||
        user.connection?.toString() === targetId
      );
    });

    if (found) {
      setIsCurrentUserInConnection(true);
      setConnectionNull(false);
    } else {
      const isPending = authState.connectionRequest?.find(
        (req) => req._id?.toString() === targetId,
      );
      setIsCurrentUserInConnection(isPending ? true : false);
      setConnectionNull(isPending ? true : false);
    }
  }, [authState.connections, authState.connectionRequest, userProfile]);

  useEffect(() => {
    getUsersPost();
  }, []);

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          <div className={styles.backDropContainer}>
            {/* <img
              src={`${BASE_URL}/uploads/${userProfile?.userId?.profilePicture}`}
              alt="profile"
              width={200}
            /> */}
          <img
  src={getProfilePic(userProfile?.userId?.profilePicture)}
  alt="profile"
  width={200}
/>
          </div>
          <div className={styles.profileContainer_details}>
            <div className={styles.profileContainer_flex}>
              <div style={{ flex: "0.8" }}>
                <div
                  style={{
                    display: "flex",
                    width: "fit-content",
                    alignItems: "center",
                    gap: "1.2rem",
                  }}
                >
                  <h2>{userProfile?.userId?.name}</h2>
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
                  {isCurrentUserInConnection ? (
                    <button className={styles.connectedButton}>
                      {isConnectionNull ? "Pending" : "Connected"}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        const token = localStorage.getItem("token");

                        const user_id =
                          userProfile?.userId?._id || userProfile?._id;

                        if (!token || !user_id) {
                          console.error("Missing token or user_id", {
                            token,
                            user_id,
                          });
                          return;
                        }

                        dispatch(sendConnectionRequest({ token, user_id }));
                      }}
                      className={styles.connectBtn}
                    >
                      Connect
                    </button>
                  )}

                  <div
                    onClick={async () => {
                      const userId =
                        userProfile?.userId?._id ?? userProfile?._id;

                      if (!userId) {
                        alert("User profile not loaded.");
                        return;
                      }

                      try {
                        const response = await clientServer.get(
                          `/user/download_resume?id=${userId}`,
                          {
                            responseType: "blob",
                          },
                        );

                        const url = window.URL.createObjectURL(
                          new Blob([response.data]),
                        );
                        const link = document.createElement("a");
                        link.href = url;
                        link.setAttribute("download", "resume.pdf");
                        document.body.appendChild(link);
                        link.click();
                        link.remove();
                        window.URL.revokeObjectURL(url);
                      } catch (err) {
                        console.error("Download failed:", err);
                        alert("Failed to download resume.");
                      }
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <svg
                      style={{ width: "1.2em" }}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                  </div>
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
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}



export async function getServerSideProps(context) {
  const { username } = context.params; // ← change query to params

  console.log("Username:", username);

  if (!username) return { notFound: true };

  try {
    const request = await clientServer.get(
      "/user/get_profile_based_on_username",
      { params: { username } },
    );

    console.log("Response:", request.data);

    if (!request.data.profile) return { notFound: true };

    return { props: { userProfile: request.data.profile } };
  } catch (error) {
    console.error("Error:", error.message);
    return { notFound: true };
  }
}
