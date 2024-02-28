import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userDetails: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    addUserDetail: (state, action) => {
      state.userDetails = action.payload;
    },
  },
});

export const { addUserDetail } = authSlice.actions;

export default authSlice.reducer;
