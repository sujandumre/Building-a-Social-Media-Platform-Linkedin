
import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const getAllPosts = createAsyncThunk(
  "post/getAllPosts",
  async (_ , thunkAPI) => {
    try {
      const response = await clientServer.get('/post')

      return thunkAPI.fulfillWithValue(response.data)

    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data)
    }
  }
) 

export const createPost = createAsyncThunk(
  "post/createPost",
  async (userData, thunkAPI)=> {
    const {file,body} = userData;

    try {
      const formData = new FormData();
      formData.append('token',localStorage.getItem('token'))
      formData.append('body', body)
      formData.append('media', file)

      const response = await clientServer.post("/post", formData, {
        headers: {
          'Content-Type':'multipart/form-data'
        }
      });

      if(response.status === 200) {
        // return thunkAPI.fulfillWithValue("Post Uploaded")
        return thunkAPI.fulfillWithValue(response.data)
      } else {
        return thunkAPI.rejectWithValue("post not Uploaded")
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
  }
)


export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (post_id, thunkAPI) => {
    try {
      const response = await clientServer.delete("/delete_post", {
        data: {
          token: localStorage.getItem("token"),
          post_id:post_id.post_id
        }
      });
      return thunkAPI.fulfillWithValue(response.data)
    } catch (error) {
      return thunkAPI.rejectWithValue("something went wrong")
    }
    
  }
)

export const incrementPostLike = createAsyncThunk(
  "post/incrementLike",
  async (data, thunkAPI)=> {
    try {
      const response = await clientServer.post(`/increment_post_likes`, {
        // post_id: post.post_id
        post_id: data.post_id
      })
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
)

export const getAllComments = createAsyncThunk(
  "post/getAllComments",
  async (postData, thunkAPI) => {
    try {
      const post_id = postData?.post_id;

      if (!post_id) {
        throw new Error("post_id is missing");
      }

      const response = await clientServer.post("/get_comments", {
        post_id,
      });

      return thunkAPI.fulfillWithValue({
        comments: response.data,
        post_id,
      });

    } catch (error) {
      console.log("GET COMMENTS ERROR:", error);

      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || error.message
      );
    }
  }
);

export const createComment = createAsyncThunk(
  "post/createComment",
  async (data, thunkAPI) => {
    try {

      const response = await clientServer.post("/create_comment", {
        token: localStorage.getItem("token"),
        post_id: data.post_id,
        body: data.body,
      });

      return thunkAPI.fulfillWithValue(response.data);

    } catch (error) {

      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Failed to create comment"
      );
    }
  }
);


export const deleteComment = createAsyncThunk(
  "post/deleteComment",
  async (data, thunkAPI) => {
    try {

      await clientServer.delete("/delete_comment", {
        data: {
          token: localStorage.getItem("token"),
          comment_id: data.comment_id,
        },
      });

      return thunkAPI.fulfillWithValue(data.comment_id);

    } catch (error) {

      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Failed to delete comment"
      );
    }
  }
);
