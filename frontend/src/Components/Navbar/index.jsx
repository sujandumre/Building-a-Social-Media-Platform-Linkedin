
import React from 'react'
import styles from "./styles.module.css"
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { reset } from '@/redux/reducer/authReducer' 
import { signOut } from "next-auth/react";

export default function NavBarComponent() {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth)

  return (
    <div className={styles.container}>
      <nav className={styles.navBar}>
        <h1 style={{ cursor: "pointer" }} onClick={() => router.push("/")}>
          Pro Connect
        </h1>

        <div className={styles.navBarOptionContainer}>
          {authState.profileFetched && (
            <div style={{ display: "flex", gap: "1.2rem" }}>
              <p>{authState?.user?.userId?.name}</p>
              <p onClick={()=> {
                router.push("/profile");
              }} 
              style={{ fontWeight: "bold", cursor: "pointer" }}>Profile</p>
             
              <p
  onClick={async () => {
    localStorage.removeItem("token");
    dispatch(reset());
    await signOut({ redirect: false }); 
    router.push("/login");
  }}
  style={{ fontWeight: "bold", cursor: "pointer" }}
>
  Logout
</p>
            </div>
          )}

          {!authState.profileFetched && (
            <div onClick={() => router.push("/login")} className={styles.buttonJoin}>
              <p>Be a part</p>
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}
