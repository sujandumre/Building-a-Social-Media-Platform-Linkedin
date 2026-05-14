import { getAllPosts } from "@/redux/action/postAction"
import  { createSlice } from "@reduxjs/toolkit"

const initialState = {
  post:[],
  isError:false,
  postFetched: false,
  isLoading: false,
  loggedIn: false,
  message: "",
  comments: [],
  postId:""
}


const postSlice = createSlice({
  name:"post",
  initialState,
  reducers: {
    reset :()=> initialState,
    resetPostId:(state) => {
      state.postId = ""
    },
  },
  extraReducers: (builder) => {
    builder
    .addcase(getAllPosts.pending, (state) =>{
      state.isLoading = true
      state.message = "fetching all the posts...."
    })

    .addcase(getAllPosts.fulfilled, (state,action) =>{
      state.isLoading = false;
      state.isError = false;
      state.postFetched = true;
      state.posts = action.payload.posts
    })
    .addcase(getAllPosts.rejected, (state, action)=>{
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload
    })
  }
})

export default postSlice.reducers;