import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/authSlice.js";
import nobiErrorReducer from "./slices/errorSlice.js";

const store = configureStore({
  reducer: {
    auth: userReducer,
    nobiError: nobiErrorReducer,
  },
});

export default store;
