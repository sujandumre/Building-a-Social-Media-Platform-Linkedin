import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { getAllPosts } from "@/redux/action/postAction";
import { getAboutUser } from "@/redux/action/authAction";
// import { getAllUsers } from "@/redux/action/authAction";
import { getAllUsers } from "@/redux/action/authAction";
import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import styles from "./index.module.css";
import { BASE_URL } from "@/config";
import { createPost } from "@/redux/action/postAction";
export default function Dashboard() {
  const router = useRouter();

  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  // const [isTokenThere, setIsTokenThere] = useState(false);

  const postState = useSelector((state) => state.post);

  useEffect(() => {
    if (authState.isTokenThere) {
      dispatch(getAllPosts());
      dispatch(
        getAboutUser({
          token: localStorage.getItem("token"),
        }),
      );
    }
    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  }, [authState.isTokenThere]);

  const [postContent, setPostContent] = useState("");

  const [fileContent, setFileContent] = useState();

  const handleUpload = async () => {
    await dispatch(createPost({ file: fileContent, body: postContent }));
    setPostContent("");
    setFileContent(null);
  };

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.homeComponent}>
          <div className={styles.wrapper}>
            <div className={styles.createPostContainer}>
              <img
                className={styles.userProfile}
                src={`${BASE_URL}/${authState?.user?.userId?.profilePicture}`}
                alt=""
              />

              <textarea
                onChange={(e) => setPostContent(e.target.value)}
                value={postContent}
                placeholder={"what's in your mind"}
                className={styles.textAreaOfContent}
                name=""
                id=""
              ></textarea>
              <label htmlFor="fileUpload">
                <div className={styles.Fab}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </div>
              </label>
              <input
                onChange={(e) => setFileContent(e.target.files[0])}
                type="file"
                hidden
                id="fileUpload"
              />
              {postContent.length > 0 && (
                <div onClick={handleUpload} className={styles.uploadButton}>
                  Post
                </div>
              )}
            </div>

            <div className={styles.postsContainer}>
              {postState.posts.map((post) => {
                console.log("POST DATA:", post);
                return (
                  <div key={post._id} className={styles.singleCard}>
                    <div className={styles.singleCard_profileContainer}>
                      {/* <img className={styles.userProfile} src={`${BASE_URL}`} /> */}
                      <img
                        className={styles.userProfile}
                        src={
                          post.userId?.profilePicture
                            ? `${BASE_URL}/${post.userId.profilePicture}`
                            : "/default1.png"
                        }
                        alt="profile"
                      />
                      <div>
                        <p style={{ fontWeight: "bold" }}>{post.userId.name}</p>
                        <p style={{ color: "gray" }}>@{post.userId.username}</p>
                        <p style={{ paddingTop: "1.3rem" }}>{post.body}</p>

                        <div className={styles.singleCard_image}>
                          {/* <img src={`${BASE_URL}/${post.media}`}/> */}
                          
                          {post.media && (
                            <img 
                              src={`${BASE_URL}/${post.media}`}
                              alt="post"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
