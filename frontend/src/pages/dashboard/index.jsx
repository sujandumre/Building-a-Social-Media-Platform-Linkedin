import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from 'next/router'
import { getAllPosts } from '@/redux/action/postAction';
import { getAboutUser } from '@/redux/action/authAction';
import UserLayout from '@/layout/UserLayout';

export default function Dashboard() {

  const router = useRouter();

  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth)

  const [isTokenThere, setIsTokenThere] = useState(false);

  useEffect(()=>{
    if (localStorage.getItem('token') === null) {
      router.push('/login')
    }
    setIsTokenThere(true)
  })

  useEffect(()=>{

    if (isTokenThere) {
      dispatch(getAllPosts())
      dispatch(getAboutUser({
         token: localStorage.getItem('token')
      }))
    }
  }, [isTokenThere])


  // return (
  //   <div>
  //     {authState.profileFetched &&  <div>

  //       hey {authState.user.userId.name}
  //   </div>}
  //   </div>
  // )

  return (
  <UserLayout>
    {authState.profileFetched && authState.user?.userId && (
      <div>
        hey {authState.user.userId.name}
      </div>
    )}
  </UserLayout>
);
}
