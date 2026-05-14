// import { configureStore } from "@reduxjs/toolkit";

// export const store = configureStore({
//   reducer:{}
// })


import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";
import postReducer from "./reducer/postReducer";


const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postReducer,
  },
});

export default store;