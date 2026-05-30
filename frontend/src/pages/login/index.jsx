

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import UserLayout from "@/layout/UserLayout";
import styles from "./style.module.css";
import { loginUser, registerUser } from "@/redux/action/authAction";

import { signIn, useSession } from "next-auth/react";
import { emptyMessage, setTokenIsThere } from "@/redux/reducer/authReducer"; 

function LoginComponent() {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: session } = useSession();

  const [userLoginMethod, setUserLoginMethod] = useState(false);

  const [email, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");


 
  useEffect(() => {
    if (authState.loggedIn) {
      router.replace("/dashboard");
    }
  }, [authState.loggedIn, router]);


useEffect(() => {
  if (session?.accessToken) {
    console.log("Google token:", session.accessToken); // ← check this
    localStorage.setItem("token", session.accessToken); // ← store backend JWT
    dispatch(setTokenIsThere());
    router.push("/dashboard");
  }
}, [session]);

 
  useEffect(() => {
    dispatch(emptyMessage());
  }, [userLoginMethod, dispatch]);


  const handleRegister = () => {
  console.log({
    username,
    name,
    email,
    password,
  });

  dispatch(
    registerUser({
      username,
      password,
      email,
      name,
    })
  );
};


  const handleLogin = async () => {
  if (!email || !password) {
    return alert("All fields are required");
  }

  dispatch(
    loginUser({
      email,
      password,
    })
  );
};

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>

          {/* LEFT SIDE */}
          <div className={styles.cardContainer_left}>

            <p className={styles.cardleft_heading}>
              {userLoginMethod ? "Sign In to LinkedIn" : "Sign Up to LinkedIn"}
            </p>

            {/* MESSAGE */}
            <p style={{ color: authState.isError ? "red" : "green" }}>
              {typeof authState.message === "object"
                ? authState.message?.message || authState.message?.text || ""
                : authState.message}
            </p>

            <div className={styles.inputContainer}>
              {/* BUTTON */}


{/* ← ADD THIS BELOW */}
<div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "10px 0" }}>
  <hr style={{ flex: 1 }} />
  <p style={{ color: "gray", fontSize: "12px" }}>OR</p>
  <hr style={{ flex: 1 }} />
</div>

<div
  className={styles.buttonWithOutline}
  onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}
>
  <svg width="20" height="20" viewBox="0 0 48 48">
  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
</svg>

  
  <p>Continue with Google</p>
</div>

              {/* SIGN UP FIELDS */}
              {!userLoginMethod && (
                <div className={styles.inputRow}>
                  <input
                    onChange={(e) => setUsername(e.target.value)}
                    className={styles.inputField}
                    type="text"
                    placeholder="Username"
                  />

                  <input
                    onChange={(e) => setName(e.target.value)}
                    className={styles.inputField}
                    type="text"
                    placeholder="Name"
                  />
                </div>
              )}

              <input
                onChange={(e) => setEmailAddress(e.target.value)}
                className={styles.inputField}
                type="text"
                placeholder="Email"
              />

              <input
                onChange={(e) => setPassword(e.target.value)}
                className={styles.inputField}
                type="password"
                placeholder="Password"
              />

              {/* BUTTON */}
              <div
                className={styles.buttonWithOutline}
                onClick={() => {
                  if (userLoginMethod) {
                    handleLogin();
                  } else {
                    handleRegister();
                  }
                }}
              >
                <p>
                  {userLoginMethod ? "Sign In" : "Sign Up"}
                </p>
              </div>

            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className={styles.cardContainer_right}>

            {userLoginMethod ? (
              <p>Don't have an Account?</p>
            ) : (
              <p>Already Have an Account?</p>
            )}

            <div
              onClick={() => setUserLoginMethod(!userLoginMethod)}
              style={{ color: "black", textAlign: "center" }}
              className={styles.buttonWithOutline}
            >
              <p>
                {userLoginMethod ? "Sign Up" : "Sign In"}
              </p>
            </div>

          </div>

        </div>
      </div>
    </UserLayout>
  );
}

export default LoginComponent;