

import { createSlice } from "@reduxjs/toolkit";
import { getAboutUser, getAllUsers, getMyconnectionRequests, getConnectionsRequest, loginUser, registerUser } from "../../action/authAction";
import { AcceptConnection } from "@/redux/action/postAction";

const initialState = {
  user: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  loggedIn: false,
  message: "",
  isTokenThere: false,
  profileFetched: false,
  connections: [],
  connectionRequest: [],
  all_users:[],
  all_profiles_fetched:true
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    reset: () => initialState,

    handleLoginUser: (state) => {
      state.message = "hello";
    },

    emptyMessage: (state) => {
      state.message = "";
    },
    setTokenIsThere: (state) => {
      state.isTokenThere = true
    },
    setTokenIsNotThere: (state)=> {
      state.isTokenThere = false
    }
  },

  extraReducers: (builder) => {
    builder

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Knocking the door...";
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.loggedIn = true;

        state.user = action.payload;

        state.message = "Login Successful";
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;

        state.message =
          action.payload?.message || "Login Failed";
      })

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;

        state.message = "Registering you...";
      })

      .addCase(registerUser.fulfilled, (state, action) => {
  state.isLoading = false;
  state.isError = false;
  state.isSuccess = true;

  state.loggedIn = false; 

  state.message = "Registration successful. Please login.";
})

      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;

        state.message =
          action.payload?.message ||
          "Registration Failed";
      })
      .addCase(getAboutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.profileFetched = true;
        state.user = action.payload
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.all_profiles_fetched= true;
         state.all_users = action.payload.profiles;
      })
      .addCase(getConnectionsRequest.fulfilled, (state,action) => {
        state.connections= action.payload
      })
      .addCase(getConnectionsRequest.rejected, (state,action) => {
        state.message= action.payload
      })
      .addCase(getMyconnectionRequests.fulfilled, (state, action) => {
        state.connectionRequest = action.payload
      })
      .addCase(getMyconnectionRequests.rejected, (state, action) => {
        state.message= action.payload
      })
      .addCase(AcceptConnection.fulfilled, (state, action) => {
  state.message = "Connection accepted";
  
  state.connectionRequest = state.connectionRequest.filter(
    (user) => user._id !== action.meta.arg.connectionId
  );
})
.addCase(AcceptConnection.rejected, (state, action) => {
  state.message = action.payload;
})

  },
 
});



export const { reset, emptyMessage, setTokenIsThere, setTokenIsNotThere } =
  authSlice.actions;

export default authSlice.reducer;