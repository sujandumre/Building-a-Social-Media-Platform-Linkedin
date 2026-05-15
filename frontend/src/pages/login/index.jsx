// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import { useSelector, useDispatch } from "react-redux";
// import UserLayout from "@/layout/UserLayout";
// import styles from "./style.module.css";
// import { loginUser, registerUser } from "@/redux/action/authAction";
// import { emptyMessage } from "@/redux/reducer/authReducer";

// function LoginComponent() {
//   const authState = useSelector((state) => state.auth);
//   const dispatch = useDispatch();
//   const router = useRouter();

//   const [userLoginMethod, setUserLoginMethod] = useState(false);

//   const [email, setEmailAddress] = useState("");
//   const [password, setPassword] = useState("");
//   const [username, setUsername] = useState("");
//   const [name, setName] = useState("");

//   // redirect if logged in
//   useEffect(() => {
//     if (authState.loggedIn) {
//       router.push("/dashboard");
//     }
//   }, [authState.loggedIn, router]);

//   useEffect(() => {
//     if(localStorage.getItem("token")) {
//       router.push("/dashboard")
//     }
//   }, [])

//   useEffect(()=> {
//     dispatch(emptyMessage());
//   }, [userLoginMethod])


//   const handleRegister = () => {
//     console.log("registering.")
//     dispatch(registerUser({ username, password, email, name }));
//   };

//   const handleLogin = () => {
//     console.log("login.....")
//     dispatch(loginUser({ email, password }));
//   };

//   return (
//     <UserLayout>
//       <div className={styles.container}>
//         <div className={styles.cardContainer}>
          
//           {/* LEFT SIDE */}
//           <div className={styles.cardContainer_left}>
            
//             <p className={styles.cardleft_heading}>
//               {userLoginMethod ? "Sign In" : "Sign Up"}
//             </p>

//             {/* SAFE MESSAGE RENDER */}
//             <p
//               style={{ color: authState.isError ? "red" : "green" }}
//             >
//               {typeof authState.message === "object"
//                 ? authState.message?.message || authState.message?.text || ""
//                 : authState.message}
//             </p>

//             <div className={styles.inputContainer}>
              
//               {/* SIGN UP ONLY FIELDS */}
//               {!userLoginMethod && (
//                 <div className={styles.inputRow}>
//                   <input
//                     onChange={(e) => setUsername(e.target.value)}
//                     className={styles.inputField}
//                     type="text"
//                     placeholder="Username"
//                   />

//                   <input
//                     onChange={(e) => setName(e.target.value)}
//                     className={styles.inputField}
//                     type="text"
//                     placeholder="Name"
//                   />
//                 </div>
//               )}

//               <input
//                 onChange={(e) => setEmailAddress(e.target.value)}
//                 className={styles.inputField}
//                 type="text"
//                 placeholder="Email"
//               />

//               <input
//                 onChange={(e) => setPassword(e.target.value)}
//                 className={styles.inputField}
//                 type="password"
//                 placeholder="Password"
//               />

//               {/* MAIN BUTTON */}
//               <div
//                 className={styles.buttonWithOutline}
//                 onClick={() => {
//                   if (userLoginMethod) {
//                     handleLogin();
//                   } else {
//                     handleRegister();
//                   }
//                 }}
//               >
//                 <p>{userLoginMethod ? "Sign In" : "Sign Up"}</p>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT SIDE */}
//           <div className={styles.cardContainer_right}>
          
//              {userLoginMethod ? <p>Don't have an Account?</p> : <p>Already Have an Account?</p> }
             

//              <div 
//              onClick={() => setUserLoginMethod(!userLoginMethod)}
//              style={{ color: "black", textAlign:"center" }}
//               className={styles.buttonWithOutline}>
//               <p>
//                 {userLoginMethod ? "Sign Up" : "Sign In"}
//               </p>
//             </div>
//           </div>

//         </div>
//       </div>
//     </UserLayout>
//   );
// }


// export default LoginComponent;



import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import UserLayout from "@/layout/UserLayout";
import styles from "./style.module.css";
import { loginUser, registerUser } from "@/redux/action/authAction";
import { emptyMessage } from "@/redux/reducer/authReducer";

function LoginComponent() {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const [userLoginMethod, setUserLoginMethod] = useState(false);

  const [email, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");

  // ----------------------------
  // REDIRECT AFTER LOGIN (ONLY REDUX)
  // ----------------------------
  useEffect(() => {
    if (authState.loggedIn) {
      router.replace("/dashboard");
    }
  }, [authState.loggedIn, router]);

  // ----------------------------
  // RESET MESSAGE ON TOGGLE
  // ----------------------------
  useEffect(() => {
    dispatch(emptyMessage());
  }, [userLoginMethod, dispatch]);

  // ----------------------------
  // REGISTER
  // ----------------------------
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

  // ----------------------------
  // LOGIN
  // ----------------------------
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
              {userLoginMethod ? "Sign In" : "Sign Up"}
            </p>

            {/* MESSAGE */}
            <p style={{ color: authState.isError ? "red" : "green" }}>
              {typeof authState.message === "object"
                ? authState.message?.message || authState.message?.text || ""
                : authState.message}
            </p>

            <div className={styles.inputContainer}>

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