// import { getAllPosts } from "@/redux/action/postAction"
// import  { createSlice } from "@reduxjs/toolkit"

// const initialState = {
//   post:[],
//   isError:false,
//   postFetched: false,
//   isLoading: false,
//   loggedIn: false,
//   message: "",
//   comments: [],
//   postId:""
// }

// const postSlice = createSlice({
//   name:"post",
//   initialState,
//   reducers: {
//     reset :()=> initialState,
//     resetPostId:(state) => {
//       state.postId = ""
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//     .addcase(getAllPosts.pending, (state) =>{
//       state.isLoading = true
//       state.message = "fetching all the posts...."
//     })

//     .addcase(getAllPosts.fulfilled, (state,action) =>{
//       state.isLoading = false;
//       state.isError = false;
//       state.postFetched = true;
//       state.posts = action.payload.posts
//     })
//     .addcase(getAllPosts.rejected, (state, action)=>{
//       state.isLoading = false;
//       state.isError = true;
//       state.message = action.payload
//     })
//   }
// })

// export default postSlice.reducers;

import { createSlice } from "@reduxjs/toolkit";
import { getAllPosts, createPost } from "@/redux/action/postAction";

const initialState = {
  posts: [], // FIXED (consistent naming)
  isError: false,
  postFetched: false,
  isLoading: false,
  message: "",
  comments: [],
  postId: "",
};

const postSlice = createSlice({
  name: "post",
  initialState,

  reducers: {
    reset: () => initialState,

    resetPostId: (state) => {
      state.postId = "";
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getAllPosts.pending, (state) => {
        state.isLoading = true;
        state.message = "Fetching all posts...";
      })

      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.postFetched = true;

        state.posts = action.payload.posts.reverse(); // FIXED
      })

      .addCase(getAllPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Failed to fetch posts";
      });
      // .addCase(createPost.pending, (state) => {
      //   state.isLoading = true;
      //   state.message = "Creating post...";
      // })
      // .addCase(createPost.fulfilled, (state, action) => {
      //   console.log("NEW POST FROM REDUX:", action.payload);
      //   state.isLoading = false;
      //   state.isError = false;

      //   // IMPORTANT: add new post to UI immediately
      //   state.posts.unshift(action.payload);
      // })
      // .addCase(createPost.rejected, (state, action) => {
      //   state.isLoading = false;
      //   state.isError = true;
      //   state.message = action.payload || "Post creation failed";
      // });
  },
});

export default postSlice.reducer;
