
import { createSlice } from "@reduxjs/toolkit";
import { getAllPosts,  getAllComments, sendConnectionRequest} from "@/redux/action/postAction";

const initialState = {
  posts: [], 
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
      })
     

      .addCase(getAllComments.fulfilled, (state, action) => {
      state.comments = action.payload.comments.comments || [];
      state.postId = action.payload.post_id;
    })

    .addCase(sendConnectionRequest.fulfilled, (state, action) => {
      state.message = action.payload; 
    })
    .addCase(sendConnectionRequest.rejected, (state, action) => {
      state.message = action.payload; 
    })
  },
});

export const { resetPostId } = postSlice.actions;
export default postSlice.reducer;
