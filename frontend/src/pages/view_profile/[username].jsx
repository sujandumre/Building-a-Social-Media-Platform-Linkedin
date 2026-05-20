import { clientServer } from '@/config';
import { useSearchParams } from 'next/navigation'
import React from 'react'
import { useEffect } from 'react';

export default function ViewProfilePage({userProfile}) {

  const searchParamers = useSearchParams();

  useEffect(()=> {
    console.log(" From view : view Profile")
  });
  return (
    <div>{userProfile.userId.name}</div>
  )
}


export async function getServerSideProps(context) {

  console.log("From View")
  console.log(context.query.username)

  const request = await clientServer.get("/user/get_profile_based_on_username",{
    params: {
      username: context.query.username
    }
  })

  const response = await request.data;

  console.log(response)
  return { props: { userProfile: request.data.profile }}
}
