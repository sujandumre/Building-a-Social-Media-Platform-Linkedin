


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




export const getConnectionsRequest = createAsyncThunk(
  "user/getConnectionRequests",
  async (user, thunkAPI) => {
    try{
      console.log("user passed:", user); // ← check this
      console.log("token:", user?.token); // ← is token here?

      const token = user?.token || localStorage.getItem("token"); // ← fallback to localStorage
      
      const response = await clientServer.get("/getConnectionRequests", {
        params: { token },
      });

      return response.data.connections;

    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);


export const getMyconnectionRequests = createAsyncThunk(
  "user/getMyConnectionRequests",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.get("/getMyConnectionRequests", {
        params: {
          token: user.token
        }
      });
      
      return thunkAPI.fulfillWithValue(response.data.connections ?? []);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { message: "Failed" });
    }
  }
);



export const updateProfileData = createAsyncThunk(
  "user/updateProfileData",
  async (data, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      
      console.log("1. Token from localStorage:", token); // ← is token here?
      console.log("2. Data being sent:", data);           // ← what data is sent?
      console.log("3. Full request body:", { token, ...data }); // ← full body

      const response = await clientServer.post("/update_profile_data", {
        token,
        ...data,
      });

      console.log("4. Response:", response.data); // ← did it succeed?
      return response.data;

    } catch (error) {
      console.log("5. Error:", error.response?.data); // ← what error?
      console.log("6. Error status:", error.response?.status);
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);