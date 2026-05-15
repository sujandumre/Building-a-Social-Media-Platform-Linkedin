import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from 'next/router'
import { getAllPosts } from '@/redux/action/postAction';
import { getAboutUser } from '@/redux/action/authAction';
import { getAllUsers } from '@/redux/action/authAction';
import UserLayout from '@/layout/UserLayout';
import DashboardLayout from '@/layout/DashboardLayout';

export default function Dashboard() {

  const router = useRouter();

  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth)

  // const [isTokenThere, setIsTokenThere] = useState(false);

  

  useEffect(()=>{

    if (authState.isTokenThere) {
      dispatch(getAllPosts())
      dispatch(getAboutUser({
         token: localStorage.getItem('token')
      }))
    }
        if(!authState.all_profiles_fetched) {
          dispatch(getAllUsers());
        }
  }, [authState.isTokenThere])


  // return (
  //   <div>
  //     {authState.profileFetched &&  <div>

  //       hey {authState.user.userId.name}
  //   </div>}
  //   </div>
  // )

  return (
  <UserLayout>


    <DashboardLayout>
      <h1>Dashboard</h1>
    </DashboardLayout>
  </UserLayout>
);
}
