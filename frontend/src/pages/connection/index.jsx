import React from 'react'
import UserLayout from '@/layout/UserLayout'
import DashboardLayout from '@/layout/DashboardLayout'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getMyconnectionRequests } from '../../redux/action/authAction'


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
    }
  }, []);

  return (
    <UserLayout>
      <DashboardLayout>
        <h1>Connection Requests</h1>
        {authState?.connections?.length > 0 ? (
          authState.connections.map((user, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem", borderBottom: "1px solid #eee" }}>
              <img
                src={`${BASE_URL}/uploads/${user.profilePicture}`}
                alt={user.name}
                style={{ width: "50px", height: "50px", borderRadius: "50%" }}
              />
              <div>
                <p style={{ fontWeight: "bold" }}>{user.name}</p>
                <p style={{ color: "gray" }}>@{user.username}</p>
              </div>
              <button onClick={() => {
                dispatch(acceptConnectionRequest({
                  token: localStorage.getItem("token"),
                  connectionId: user._id
                }));
              }}>Accept</button>
            </div>
          ))
        ) : (
          <p>No connection requests</p>
        )}
      </DashboardLayout>
    </UserLayout>
  );
}