import { createSlice } from "@reduxjs/toolkit";

export interface UploadState {
  successCount: number;
  failedCount: number;
}

const initialState: UploadState = {
  successCount: 0,
  failedCount: 0,
};

const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    incrementSuccess(state) {
      state.successCount += 1;
    },
    incrementFailed(state) {
      state.failedCount += 1;
    },
  },
});

export const { incrementSuccess, incrementFailed } = uploadSlice.actions;
export default uploadSlice.reducer;
