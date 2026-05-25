import React from "react";
import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getMyconnectionRequests, getConnectionsRequest } from "../../redux/action/authAction";
import styles from "./index.module.css";
import { BASE_URL, clientServer } from "@/config";
import { AcceptConnection } from "../../redux/action/postAction";

// export default function ConnectionsPage() {

//   const dispatch = useDispatch();
//   const authState = useSelector((state) => state.auth);

//   useEffect(() => {
//     dispatch(getMyconnectionRequests({"token":localStorage.getItem("token")}));
//   }, [])

//   useEffect(() => {
//     if(authState.connectionRequest.length != 0) {
//       console.log(authState.connectionRequest);
//     }
//   }, [authState.connectionRequest])

//   return (
//     <UserLayout>

//     <DashboardLayout>
//       <h1>Connections</h1>
//     </DashboardLayout>
//   </UserLayout>
//   )
// }

export default function ConnectionsPage() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(getMyconnectionRequests({ token }));
      dispatch(getConnectionsRequest({ token })); 
    }
  }, []);
  useEffect(() => {
  console.log("AUTH STATE connections:", authState.connections);
  console.log("AUTH STATE connectionRequest:", authState.connectionRequest);
}, [authState.connections, authState.connectionRequest]);

  const router = useRouter();

  return (
    <UserLayout>
      <DashboardLayout>
        {/* 
        <div>
          <h1>Connections</h1>

          {authState.connectionRequest.length === 0 && <h1>No connection Requests</h1>}

          {authState.connectionRequest.length != 0 && authState.connectionRequest.map((user, index)=> {
            return (
              <div className={styles.userCard} key={index}>
                <div style={{display: "flex", alignItems: "center", gap:"1.2rem"}}>
                  <div className={styles.profilePicture}>
                    <img src={`${BASE_URL}/uploads/${user.profilePicture}`} alt={user.name} style={{width: "100%", height: "100%", borderRadius: "50%"}} />
                  </div>

                  <div className={styles.userInfo}>
                    <h3>{user.userId?.name}</h3>
                    <p>{user.userId?.username}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div> */}
        
        <div style={{display: "flex", flexDirection:"column", gap:"1.7rem"}} className={styles.container}>
          <h2>My Connections</h2>

          {authState.connectionRequest.length === 0 && (
            <p>No connection requests</p>
          )}


          {authState.connectionRequest
            .filter((user) => user != null)
            .map((user, index) => (
              <div
                // onClick={()=> {
                //   router.push(`view_profile/${user.userId?.username}`);

                // }}
                onClick={() => {
                  console.log("Full user object:", user); // ✅ see exact shape
                  const username = user?.username;
                  if (!username) {
                    console.error("Username is undefined for user:", user);
                    return;
                  }
                  router.push(`/view_profile/${username}`);
                }}
                className={styles.userCard}
                key={index}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.2rem",
                  }}
                >
                  <div className={styles.profilePicture}>
                    <img
                      src={`${BASE_URL}/uploads/${user?.profilePicture ?? "default.jpg"}`}
                      alt={user?.name ?? "User"}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                      }}
                    />
                  </div>
                  <div className={styles.userInfo}>
                    <h3>{user?.name}</h3>
                    <p>@{user?.username}</p>
                  </div>
                </div>
                <button
                  className={styles.acceptBtn}
                  onClick={() => {
                    dispatch(
                      AcceptConnection({
                        token: localStorage.getItem("token"),
                        connectionId: user?._id,
                        action: "accept",
                      }),
                    );
                  }}
                >
                  Accept
                </button>
              </div>
            ))}
            
            <h4>My Network</h4>
            {authState.connections.length === 0 && <p>No connections yet</p>}

  {authState.connections
    .filter((user) => user != null)
    .map((user, index) => (
      <div
        onClick={() => {
          // ✅ handle both shapes: populated object or just id string
          const username = user?.username || user?.connection?.username;
          if (!username) return;
          router.push(`/view_profile/${username}`);
        }}
        className={styles.userCard}
        key={index}
        style={{ cursor: "pointer" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
          <div className={styles.profilePicture}>
            <img
              src={`${BASE_URL}/uploads/${user?.profilePicture ?? user?.connection?.profilePicture ?? "default.jpg"}`}
              alt={user?.name ?? "User"}
              style={{ width: "100%", height: "100%", borderRadius: "50%" }}
            />
          </div>
          <div className={styles.userInfo}>
            <h3>{user?.name ?? user?.connection?.name}</h3>
            <p>@{user?.username ?? user?.connection?.username}</p>
          </div>
        </div>
      </div>
    ))}
        </div>

       
      </DashboardLayout>
    </UserLayout>
  );
}
