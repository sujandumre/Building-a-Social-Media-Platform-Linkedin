import { BASE_URL, clientServer } from '@/config';
import DashboardLayout from '@/layout/DashboardLayout';
import UserLayout from '@/layout/UserLayout';
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { getAllPosts } from '@/redux/action/postAction';
import { useRouter } from 'next/router';
import styles from "./index.module.css";
import { useDispatch, useSelector } from 'react-redux';
import { getConnectionsRequest } from '@/redux/action/authAction';

import { sendConnectionRequest } from '@/redux/action/postAction';

export default function ViewProfilePage({userProfile}) {
  const router = useRouter();
  const postReducer = useSelector((state) => state.postReducer);
  const authState = useSelector((state) => state.auth);
  const dispatch= useDispatch();
  const [userPosts, setUserPosts] = useState([]);
  const [isCurrentUserInConnection, setIsCurrentUserInConnection]=useState(false);
  const [isConnectionNull, setConnectionNull] = useState(true);
  const searchParamers = useSearchParams();

  // const getUsersPost = async ()=> {
  //   console.log("Token:", localStorage.getItem("token"));
  //   // await dispatch (getAllPosts());
  //   dispatch (getAllPosts());
  //   // await dispatch(getConnectionsRequest({token: localStorage.getItem("token")}));
  //   dispatch(getConnectionsRequest({
  //   token: localStorage.getItem("token"),}));
  // }

  const getUsersPost = async () => {
  const token = localStorage.getItem("token");
  
  dispatch(getAllPosts());
  
  if (token) {
    dispatch(getConnectionsRequest({ token }));
  }
};
//   useEffect(()=> {
//     let post = postReducer.posts.filter((post) => {
//       return post.userId.username === router.query.username
//     })

//     setUserPosts(post);
//   },[postReducer.posts]
// );

useEffect(() => {
  const filteredPosts = postReducer?.posts?.filter((post) => {
    return post?.userId?.username === router.query.username;
  }) || [];

  setUserPosts(filteredPosts);

}, [postReducer?.posts, router.query.username]);

useEffect(()=> {
    console.log(authState.connections, userProfile.userId?._id)
    if (authState.connections.some(user => user.connection._id === userProfile.userId?._id)) {
      setIsCurrentUserInConnection(true)
      if(authState.connections.find(user => user.connectionId._id === userProfile.userId?._id).status_accepted === true) {
        setIsCurrentUserInConnection(false)
      } 
    }
  }, [authState.connections])


  useEffect(()=> {
    getUsersPost();
  }, [])


  return (
    <UserLayout>

    <DashboardLayout>
      <div className={styles.container}>
        <div className={styles.backDropContainer} >
        {/* src={`${BASE_URL}/${userProfile.userId.profilePicture}`} alt="backdrop"> */}
        <img
  src={`${BASE_URL}/uploads/${userProfile?.userId?.profilePicture}`}
  alt="profile"
  width={200}
/>
</div>
<div className={styles.profileContainer_details}>

  <div style={{display:"flex", gap:"0.7rem"}}>

    <div style={{flex:"0.8"}}>

      <div style={{ display:"flex", width:"fit-content", alignItems: "center", gap:"1.2rem"}}>
        <h2>{userProfile?.userId?.name}</h2>
        <p style={{ color:"gray"}}>@{userProfile?.userId?.username}</p>
      </div>

      {/* {isCurrentUserInConnection ?
      <button className={styles.connectedButton}>{isConnectionNull ? "Pending": "Connected"}</button>
    :
    <button onClick={()=> {
      // dispatch(sendConnectionRequest({token: localStorage.getItem("token"),userId}))
      //  dispatch(sendConnectionRequest(userProfile._id));
      dispatch(sendConnectionRequest({ 
  token: localStorage.getItem("token"),  
  user_id: userProfile?.userId?._id 
}));


    }} className={styles.connectBtn}>Connect</button>
    } */}

    {isCurrentUserInConnection ? (
  <button className={styles.connectedButton}>
    {isConnectionNull ? "Pending" : "Connected"}
  </button>
) : (
  <button
    onClick={() => {
      const token = localStorage.getItem("token");
      // Check both possible shapes of the profile object
      const user_id = userProfile?.userId?._id || userProfile?._id;

      if (!token || !user_id) {
        console.error("Missing token or user_id", { token, user_id });
        return;
      }

      dispatch(sendConnectionRequest({ token, user_id }));
    }}
    className={styles.connectBtn}
  >
    Connect
  </button>
)}

    <div>
      <p>{userProfile.bio}</p>
    </div>

    </div>

    {/* <div style={{flex:"0.2"}}>
      <h3>Recent Activity</h3>
      {userPosts.map((post)=> {
        return (
          <div key={post._id} className={styles.postCard}>
            <div className={styles.card}></div>
          <div className={styles.card_profileContainer}>
            {post.media !== "" ? <img src={`${BASE_URL}/${post.media}`} alt=""/>
      }
      </div>
      <p>{post.body}</p>
          </div>
          </div>
        )
      })}

    </div> */}

    <div style={{ flex: "0.2" }}>

  <h3>Recent Activity</h3>

  {userPosts.map((post) => {

    return (

      <div key={post._id} className={styles.postCard}>

        <div className={styles.card}>

          <div className={styles.card_profileContainer}>

            {post.media !== "" ?
              <img
                src={`${BASE_URL}/uploads/${post.media}`}
                alt=""
              /> : <div style={{ width: "3.4rem", height: "3.4rem"}}></div>
  }

          </div>

          <p>{post.body}</p>

        </div>

      </div>
    );
  })}

</div>

  </div>
</div>

       <div className="workHistory">
        <h4>Work History</h4>
        <div className={styles.workHistoryContainer}>
          {
            userProfile.pastWork?.map((work, index) => {
              return (
                <div key={index} className={styles.workHistoryCard}>
                  <p style={{ fontWeight: "bold", display:"flex", alignItems:"center", gap:"0.8rem"}}>{work.company} - {work.position}</p>

                  <p>{work.years}</p>
                  </div>
              )
            })
          }
        </div>
       </div>
        </div>
      
    </DashboardLayout>
    </UserLayout>
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
