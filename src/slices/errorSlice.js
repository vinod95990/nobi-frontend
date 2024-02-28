import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  nobiError: null,
};

const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    errorCaught: (state, action) => {
      state.nobiError = action.payload;
    },
  },
});

export const { errorCaught } = errorSlice.actions;

export default errorSlice.reducer;
