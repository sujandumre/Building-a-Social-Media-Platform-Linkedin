import { BASE_URL, clientServer } from "@/config";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getAllPosts } from "@/redux/action/postAction";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getConnectionsRequest } from "@/redux/action/authAction";

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

  // const getUsersPost = async ()=> {
  //   console.log("Token:", localStorage.getItem("token"));
  //   // await dispatch (getAllPosts());
  //   dispatch (getAllPosts());
  //   // await dispatch(getConnectionsRequest({token: localStorage.getItem("token")}));
  //   dispatch(getConnectionsRequest({
  //   token: localStorage.getItem("token"),}));
  // }

  const getUsersPost = async () => {
    const token = localStorage.getItem("token");

    dispatch(getAllPosts());

    if (token) {
      dispatch(getConnectionsRequest({ token }));
    }
  };

  useEffect(() => {
    console.log("full redux state:", postReducer);
  }, [postReducer]);
  //   useEffect(()=> {
  //     let post = postReducer.posts.filter((post) => {
  //       return post.userId.username === router.query.username
  //     })

  //     setUserPosts(post);
  //   },[postReducer.posts]
  // );

  // useEffect(() => {
  //   const filteredPosts =
  //     postReducer?.posts?.filter((post) => {
  //       return post?.userId?.username === router.query.username;
  //     }) || [];

  //   setUserPosts(filteredPosts);
  // }, [postReducer?.posts, router.query.username]);

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
    console.log("=== DEBUG ===");
    console.log("router.isReady:", router.isReady);
    console.log("postReducer.posts:", postReducer?.posts);
    console.log("postReducer.posts length:", postReducer?.posts?.length);
    console.log("userProfile:", userProfile);
    console.log("profileUsername:", userProfile?.userId?.username);
    console.log("pastwork:", userProfile?.pastwork);
    console.log("first post userId:", postReducer?.posts?.[0]?.userId);
    console.log("userPosts:", userPosts);
  }, [postReducer?.posts, userPosts]);

  // useEffect(() => {
  //   console.log(authState.connections, userProfile.userId?._id);
  //   if (
  //     authState.connections.some(
  //       (user) => user.connection._id === userProfile.userId?._id,
  //     )
  //   ) {
  //     setIsCurrentUserInConnection(true);
  //     if (
  //       authState.connections.find(
  //         (user) => user.connectionId._id === userProfile.userId?._id,
  //       ).status_accepted === true
  //     ) {
  //       setIsCurrentUserInConnection(false);
  //     }
  //   }
  // }, [authState.connections]);

  useEffect(() => {
    if (!userProfile?.userId?._id || !authState?.connections) return;

    const targetId = userProfile.userId._id;

    const found = authState.connections.find(
      (user) => user.connection._id === targetId, // ← use consistent field name
    );

    if (found) {
      setIsCurrentUserInConnection(true);
      setConnectionNull(found.status_accepted !== true); // pending if not accepted
    } else {
      setIsCurrentUserInConnection(false);
      setConnectionNull(true);
    }
  }, [authState.connections, userProfile]);

  useEffect(() => {
    getUsersPost();
  }, []);

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          <div className={styles.backDropContainer}>
            {/* src={`${BASE_URL}/${userProfile.userId.profilePicture}`} alt="backdrop"> */}
            <img
              src={`${BASE_URL}/uploads/${userProfile?.userId?.profilePicture}`}
              alt="profile"
              width={200}
            />
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
                  <h2>{userProfile?.userId?.name}</h2>
                  <p style={{ color: "gray" }}>
                    @{userProfile?.userId?.username}
                  </p>
                </div>

                {/* {isCurrentUserInConnection ?
      <button className={styles.connectedButton}>{isConnectionNull ? "Pending": "Connected"}</button>
    :
    <button onClick={()=> {
      // dispatch(sendConnectionRequest({token: localStorage.getItem("token"),userId}))
      //  dispatch(sendConnectionRequest(userProfile._id));
      dispatch(sendConnectionRequest({ 
  token: localStorage.getItem("token"),  
  user_id: userProfile?.userId?._id 
}));


    }} className={styles.connectBtn}>Connect</button>
    } */}

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
                        // Check both possible shapes of the profile object
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

                  {/* <div onClick={async()=> {
                  const response = await clientServer.get(`/user/download_resume?id=${userProfile?.userId?._id}`);
                  window.open(`${BASE_URL}/${response.data.message}`, "_blank");

                }}style={{cursor: "pointer"}}>
                  <svg  style={{width: "1.2em"}}xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
</svg>

                </div> */}

                 <div
  onClick={async () => {
    const userId = userProfile?.userId?._id ?? userProfile?._id;

    if (!userId) {
      alert("User profile not loaded.");
      return;
    }

    try {
      // ✅ Use blob to handle file download from res.download()
      const response = await clientServer.get(`/user/download_resume?id=${userId}`, {
        responseType: "blob", 
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
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
  <svg style={{ width: "1.2em" }} xmlns="http://www.w3.org/2000/svg" fill="none"
    viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
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
                          {/* {post.media !== "" ? (
                            <img src={`${BASE_URL}/${post.media}`} alt="" />
                          ) : (
                            <div
                              style={{ width: "3.4rem", height: "3.4rem" }}
                            ></div>
                          )}  */}

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

              {/* <div style={{ flex: "0.2" }}>

  <h3>Recent Activity</h3>

  {userPosts.map((post) => {

    return (

      <div key={post._id} className={styles.postCard}>

        <div className={styles.card}>

          <div className={styles.card_profileContainer}>

            {post.media !== "" ?
              <img
                src={`${BASE_URL}/uploads/${post.media}`}
                alt=""
              /> : <div style={{ width: "3.4rem", height: "3.4rem"}}></div>
  }

          </div>

          <p>{post.body}</p>

        </div>

      </div>
    );
  })}

</div> */}
            </div>
          </div>

          {/* <div className="workHistory">
            <h4>Work History</h4>
            <div className={styles.workHistoryContainer}>
              {userProfile.pastwork?.map((work, index) => {
                return (
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
                );
              })}
            </div>
          </div> */}

          <div className="workHistory">
  <h4>Work History</h4>
  <div className={styles.workHistoryContainer}>
    {/* ✅ Add fallback message so you know if data is empty or missing */}
    {userProfile.pastwork?.length > 0 ? (
      userProfile.pastwork.map((work, index) => (
        <div key={index} className={styles.workHistoryCard}>
          <p style={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.8rem" }}>
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


        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export async function getServerSideProps(context) {
  console.log("From View");
  console.log(context.query.username);

  const request = await clientServer.get(
    "/user/get_profile_based_on_username",
    {
      params: {
        username: context.query.username,
      },
    },
  );

  const response = await request.data;

  console.log(response);
  return { props: { userProfile: request.data.profile } };
}
