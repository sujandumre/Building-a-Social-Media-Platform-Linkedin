import React, { useEffect } from "react";
import {
  setTokenIsThere,
  setTokenIsNotThere,
} from "@/redux/reducer/authReducer";
import styles from "./index.module.css";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getAllUsers } from "@/redux/action/authAction";
export default function DashboardLayout({ children }) {
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  // const getProfilePic = (pic) => {
  //   if (!pic || pic === "default.jpg") return "/default-avatar.png";
  //   if (pic?.startsWith("http")) return pic;
  //   return `${BASE_URL}/uploads/${pic}`;
  // };
  const getProfilePic = (pic) => {
  if (!pic || pic === "default.jpg") return "/default-avatar.png";
  if (pic?.startsWith("http")) return pic; // ← full URL
  if (pic?.startsWith("linkedin-clone/")) { // ← Cloudinary public ID
    return `https://res.cloudinary.com/dcbdckji6/image/upload/${pic}`;
  }
  return `${BASE_URL}/uploads/${pic}`; // ← local upload
};

  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      router.push("/login");
    }
    dispatch(setTokenIsThere());
  }, []);
  

  useEffect(() => {
  dispatch(getAllUsers());
}, []);

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.homeContainer}>
          <div className={styles.homeContainer_leftBar}>
            <div>
              <div
                onClick={() => {
                  router.push("/dashboard");
                }}
                className={styles.sideBarOption}
              >
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
                    d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  />
                </svg>
                <p>Home</p>
              </div>

              <div
                onClick={() => {
                  router.push("/search");
                }}
                className={styles.sideBarOption}
              >
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
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>

                <p>Search</p>
              </div>

              <div
                onClick={() => {
                  router.push("/connection");
                }}
                className={styles.sideBarOption}
              >
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
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>

                <p>Connections</p>
              </div>
            </div>
          </div>

          <div className={styles.homeContainer_feedContainer}>{children}</div>

          <div className={styles.homeContainer_extraContainer}>
            <h3>Top Profiles</h3>

            {authState.all_profiles_fetched &&
              authState.all_users?.map((profile) => {
                return (
                  <div onClick={() => {
    const username = profile?.userId?.username;
    if (!username) {
      console.error("Username is undefined for post:", profile);
      return;
    }
    router.push(`/view_profile/${username}`);
  }}
                    key={profile?.userId?._id}
                    className={styles.extraContainer_profile}
                  >
                    <img src={profile?.profile_pic} alt="" />
                    <p>{profile?.userId?.name}</p>
                  </div>
                );
              })}
          </div> 

          
        </div>
      </div>


      <div className={styles.mobileNavbarView}>
  <div
    onClick={() => router.push("/dashboard")}
    className={styles.singleNavItemHolder_mobileView}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      width="24"        // ← fix
      height="24"       // ← fix
    >
      <path strokeLinecap="round" strokeLinejoin="round"
        d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
    <p>Home</p>
  </div>

  <div
    onClick={() => router.push("/search")}
    className={styles.singleNavItemHolder_mobileView}
  >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
      strokeWidth={1.5} stroke="currentColor" width="24" height="24">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
    <p>Search</p>
  </div>

  <div
    onClick={() => router.push("/connection")}
    className={styles.singleNavItemHolder_mobileView}
  >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
      strokeWidth={1.5} stroke="currentColor" width="24" height="24">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
    <p>Connections</p>
  </div>
</div>
    </div>
  );
}
