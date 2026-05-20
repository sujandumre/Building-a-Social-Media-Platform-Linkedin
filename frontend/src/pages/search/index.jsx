// import React, { useEffect } from 'react'
// import UserLayout from '@/layout/UserLayout'
// import DashboardLayout from '@/layout/DashboardLayout'
// import { getAllPosts } from '@/redux/action/postAction';
// import { useRouter } from 'next/router';
// import { useDispatch, useSelector } from 'react-redux';
// import { BASE_URL } from '@/config';
// import { getAllUsers } from '@/redux/action/authAction';
// import { getAboutUser } from '@/redux/action/authAction';

// export default function SearchPage() {

//   const authState = useSelector((state) => state.auth)

//   const dispatch = useDispatch();

//   useEffect(()=> {
//     if(!authState.all_profiles_fetched) {
//       dispatch(getAllUsers());
//     }

//   }, [])

  
//   return (
//     <UserLayout>


//     <DashboardLayout>
//       <h1>Search</h1>

//       <div className="allUserProfile">

//        {authState.all_profiles_fetched && (authState.all_users || []).map((profile) => {
//   return (
//     <div key={profile._id} className="userProfile">
//       <img 
//         src={
//           profile.userId?.profilePicture
//             ? `${BASE_URL}/uploads/${profile.userId.profilePicture}`
//             : "/default1.png"
//         } 
//         alt="profile" 
//       />
//       <h1>{profile.userId?.name}</h1>
//       <p>{profile.userId?.email}</p>
//       <p>@{profile.userId?.username}</p>
//     </div>
//   );
// })}
//       </div>
//     </DashboardLayout>
//   </UserLayout>
//   )
// }


import styles from "./index.module.css";
import React, { useEffect } from 'react'
import UserLayout from '@/layout/UserLayout'
import DashboardLayout from '@/layout/DashboardLayout'
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '@/redux/action/authAction';
import { BASE_URL } from '@/config'; // ✅ import BASE_URL
import { useRouter } from "next/router";

export default function SearchPage() {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllUsers()); // ✅ always fetch, don't guard with all_profiles_fetched
  }, []);

  const router = useRouter();

  // ✅ debug — remove after fixing
  console.log("all_users:", authState.all_users);
  console.log("all_profiles_fetched:", authState.all_profiles_fetched);

  return (
    <UserLayout>
      <DashboardLayout>
        <h1>Search</h1>
        <div className={styles.allUserProfile}>
          {/* ✅ don't gate on all_profiles_fetched — just map safely */}
          {(authState.all_users || []).map((profile) => (
            <div 
            // onClick={()=> {
            //   router.push(`/view_profile/${user.userId.username}`);
            // }}
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
              <h1>{profile.userId?.name}</h1>
              {/* <p>{profile.userId?.email}</p> */}
              <p>@{profile.userId?.username}</p>
            </div>
          ))}

          {/* ✅ show message if empty */}
          {authState.all_users?.length === 0 && (
            <p>No users found.</p>
          )}
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}