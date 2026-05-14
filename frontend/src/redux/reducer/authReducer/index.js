// import { createSlice } from "@reduxjs/toolkit"
// import { loginUser, registerUser } from "../../action/authAction"

// const initialState = {
//   user:[],
//   isError:false,
//   isSuccess: false,
//   isLoading: false,
//   loggedIn: false,
//   message: "",
//   profileFetched: false,
//   connection: [],
//   connectionRequest: []
// }

// const authSlice = createSlice({
//   name:"auth",
//   initialState,
//   reducers: {
//     reset: () => initialState,
//     handleLoginUser: (state)=> {
//       state.message = "hello"
//     },
//     emptyMessage: (state) => {
//       state.message=""
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//     .addCase(loginUser.pending, (state) => {
//       state.isLoading = true
//       state.message = "knocking the door..."
//     })

//     .addCase(loginUser.fulfilled, (state,action) => {
//       state.isLoading = false;
//       state.isError= false;
//       state.isSuccess= true;
//       state.loggedIn= true;
//       state.message = "Login is Successfull"
//     })

//     .addCase(loginUser.rejected, (state, action)=> {
//       state.isLoading = false;
//       state.isError = true;
//       state.message = action.payload
//     })

//     .addCase(registerUser.pending, (state) => {
//       state.isLoading = true
//       state.message = "Registering you ..."
//     })

//     .addCase(registerUser.fulfilled, (state,action)=> {
//       state.isLoading = false;
//       state.isError = false;
//       state.isSuccess = true;
//       state.loggedIn = true;
//       state.message = {
//         message:"Registration is Successful, Please login In"
//       }
//     })

//     .addCase(registerUser.rejected, (state,action) => {
//       state.isLoading = false;
//       state.isError = true;
//       state.message = action.payload
//     })
//   }
// })

// export const {reset, emptyMessage } = authSlice.actions;

// export default authSlice.reducer;



import { createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser } from "../../action/authAction";

const initialState = {
  user: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  loggedIn: false,
  message: "",
  profileFetched: false,
  connection: [],
  connectionRequest: [],
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

      // .addCase(registerUser.fulfilled, (state, action) => {
      //   state.isLoading = false;
      //   state.isError = false;
      //   state.isSuccess = true;

      //   // USER IS NOT LOGGED IN YET
      //   state.loggedIn = false;

      //   state.message =
      //     "Registration Successful, Please Login";
      // })

      .addCase(registerUser.fulfilled, (state, action) => {
  state.isLoading = false;
  state.isError = false;
  state.isSuccess = true;

  state.loggedIn = false; // MUST BE FALSE

  state.message = "Registration successful. Please login.";
})

      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;

        state.message =
          action.payload?.message ||
          "Registration Failed";
      });
  },
});

export const { reset, emptyMessage } =
  authSlice.actions;

export default authSlice.reducer;