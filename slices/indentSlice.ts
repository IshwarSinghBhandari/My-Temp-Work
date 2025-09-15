import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IndentResponse } from "@/types/indentSlice"; // define this type like TripResponse

export const initialState: IndentResponse = {
  data: null,
  details: null,
  loading: false,
  error: null,
  trackingData: null,
  createIndentError: null,
  S3File: null,
};

const indentSlice = createSlice({
  name: "indent",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setIndentData: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.data = action.payload;
    },
    setCreateIndentS3File: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.S3File = action.payload;
    },
    setIndentDetails: (state, action: PayloadAction<any>) => {
      state.loading = false;
      if (state.data) {
        state.data.details = action.payload;
      } else {
        state.data = {
          ...action.payload,
          details: action.payload,
        };
      }
    },
    setError: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCreateError: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.createIndentError = action.payload;
    },
    setIndentStatus: (state, action: PayloadAction<string>) => {
      if (state.data) {
        state.data.status = action.payload;
      }
    },
    setIndentId: (state, action: PayloadAction<string | number>) => {
      if (state.data) {
        state.data.id = action.payload;
      }
    },
  },
});

export const {
  setLoading,
  setIndentData,
  setError,
  setIndentDetails,
  setIndentStatus,
  setCreateError,
  setIndentId,
  setCreateIndentS3File,
} = indentSlice.actions;

export default indentSlice.reducer;
