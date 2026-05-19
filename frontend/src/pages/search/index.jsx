import React, { useEffect } from 'react'
import UserLayout from '@/layout/UserLayout'
import DashboardLayout from '@/layout/DashboardLayout'
import { getAllPosts } from '@/redux/action/postAction';
// import { getAllUsers} from '@config/redux/reducer/authReducer';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { getAboutUser } from '@/redux/action/authAction';

export default function SearchPage() {

  const authState = useSelector((state) => state.auth)

  const dispatch = useDispatch();

  useEffect(()=> {
    if(!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }

  }, [])

  
  return (
    <UserLayout>


    <DashboardLayout>
      <h1>Search</h1>
    </DashboardLayout>
  </UserLayout>
  )
}
