// import { configureStore } from "@reduxjs/toolkit";

// export const store = configureStore({
//   reducer:{}
// })


import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";
import postReducer from "./reducer/postReducer";


// const authReducer = (state = { loggedin: false }, action) => {
//   switch (action.type) {
//     default:
//       return state;
//   }
// };

const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postReducer,
  },
});

export default store;