


import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";



// LOGIN USER
export const loginUser = createAsyncThunk(
  "user/login",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post("/login", {
        email: user.email,
        password: user.password,
      });

      // CHECK TOKEN
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);

        return thunkAPI.fulfillWithValue(response.data);
      } else {
        return thunkAPI.rejectWithValue({
          message: "Token not provided",
        });
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || {
          message: "Login failed",
        }
      );
    }
  }
);

// REGISTER USER
// export const registerUser = createAsyncThunk(
//   "user/register",
//   async (user, thunkAPI) => {
//     try {
//       const response = await clientServer.post("/register", {
//         username: user.username,
//         password: user.password,
//         email: user.email,
//         name: user.name,
//       });

//       // RETURN SUCCESS DATA
//       return thunkAPI.fulfillWithValue(response.data);

//     } catch (error) {
//       return thunkAPI.rejectWithValue(
//         error.response?.data || {
//           message: "Registration failed",
//         }
//       );
//     }
//   }
// );


// export const registerUser = createAsyncThunk(
//   "user/register",
//   async (user, thunkAPI) => {
//     try {
//       const response = await clientServer.post("/register", user);

//       console.log("REGISTER RESPONSE:", response.data);

//       return response.data; // VERY IMPORTANT
//     } catch (error) {
//       console.log("REGISTER ERROR:", error.response?.data);

//       return thunkAPI.rejectWithValue(
//         error.response?.data?.message || "Registration failed"
//       );
//     }
//   }
// );

export const registerUser = createAsyncThunk(
  "user/register",
  async (user, thunkAPI) => {
    try {

      console.log("SENDING USER:", user);

      const response = await clientServer.post("/register", user);

      console.log("REGISTER RESPONSE:", response.data);

      return response.data;

    } catch (error) {

      console.log("FULL ERROR:", error);

      console.log("REGISTER ERROR:", error.response?.data);

      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);


// GET USER INFO
export const getAboutUser = createAsyncThunk(
  "user/getAboutUser",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      const response = await clientServer.get(
        "/get_user_and_profile",
        {
          params: { token },
        }
      );
      console.log("PROFILE RESPONSE:", response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Failed to get user" }
      );
    }
    
  }
  
);


export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async(_,thunkAPI) => {
    try {
       const response = await clientServer.get(
        "/user/get_all_users")
        return thunkAPI.fulfillWithValue(response.data)
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Failed to get user" }
      );
    }
  }
)




// export const getConnectionsRequest = createAsyncThunk(
//   "user/getConnectionRequests",
//   async (user, thunkAPI)=> {
//     try {
//       const response = await clientServer.get("/user/getConnectionRequests", {

//         params: {
//           token: user?.token
//         }
//       })
//       return thunkAPI.fulfillWithValue(response.data.connections);
//     } catch (error) {

//       console.log(error);
//       return thunkAPI.rejectWithValue(error.response.data.message);
//     }
//   }
// );

export const getConnectionsRequest = createAsyncThunk(
  "user/getConnectionRequests",
  async (user, thunkAPI) => {
    try {

      const response = await clientServer.get(
        "/user/getConnectionRequests",
        {
          params: {
            token: user?.token,
          },
        }
      );

      return response.data.connections;

    } catch (error) {

      console.log(error);

      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);


// export const getMyconnectionRequests = createAsyncThunk(
//   "user/getMyConnectionRequests",
//   async (user, thunkAPI)=> {
//     try {
//       const response = await clientServer.get("/user/user_connection_request", {
//         params: {
//           token: user.token
//         }
//       });
//       return thunkAPI.fulfillWithValue(response.data.connections)
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response.data.message)
//     }
//   }
// )

export const getMyconnectionRequests = createAsyncThunk(
  "user/getMyConnectionRequests",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.get("/user/getMyConnectionRequests", {
        params: {
          token: user.token
        }
      });
      //  return the array, not the whole object
      return thunkAPI.fulfillWithValue(response.data.connections ?? []);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { message: "Failed" });
    }
  }
);
