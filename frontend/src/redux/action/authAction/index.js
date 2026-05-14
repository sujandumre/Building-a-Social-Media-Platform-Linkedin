// import { clientServer } from "@/config";
// import { createAsyncThunk } from "@reduxjs/toolkit";


// export const loginUser = createAsyncThunk(
//   "user/login",
//   async (user,thunkAPI) => {
//     try {
//       const response = await clientServer.post(`/login`,{
//         email: user.email,
//         password: user.password
//       });

//       if (response.data.token){

//         localStorage.setItem("token",response.data.token)
//       } else {
//         return thunkAPI,rejectWithValue({
//           message:"token not provided"
//         })
//       }

//       return thunkAPI.fulfillWithValue(response.data.token)
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response.data)
//     }
//   }
// )

// export const registerUser = createAsyncThunk(
//   "user/register",
//   async(user,thunkAPI) => {

//     try {
//       const request = await clientServer.post("/register",{
//         username: user.username,
//         password: user.password,
//         email: user.email,
//         name: user.name
//       })
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response.data)
//     }
//   }
// )

// export const getAboutUser = createAsyncThunk(
//   "user/getAboutUser",
//   async(user, thunkAPI) => {
//     try{

//       console.log(user);

//       const response = await clientServer.get("/get_user_and_profile", {
//         params:{
//           token:user.token
//         }
//       })
//       return thunkAPI.fulfillWithValue(response.data)

//     } catch (err) {
//       return thunkAPI.rejectWithValue(err.response.data)
//     }
//   }
// )


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


export const registerUser = createAsyncThunk(
  "user/register",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post("/register", user);

      console.log("REGISTER RESPONSE:", response.data);

      return response.data; // VERY IMPORTANT
    } catch (error) {
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
  async (user, thunkAPI) => {
    try {
      console.log(user);

      const response = await clientServer.get(
        "/get_user_and_profile",
        {
          params: {
            token: user.token,
          },
        }
      );

      return thunkAPI.fulfillWithValue(response.data);

    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || {
          message: "Failed to get user",
        }
      );
    }
  }
);