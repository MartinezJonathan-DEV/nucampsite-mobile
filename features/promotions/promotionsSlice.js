import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { baseUrl } from "../../shared/baseUrl";

export const fetchPromotions = createAsyncThunk(
  "promotion/fetchPromotions",
  async () => {
    const response = await fetch(baseUrl + "promotions");

    if (!response.ok) {
      return Promise.reject("Unable to fetch status: " + response.status);
    }

    const data = response.json();
    return data;
  }
);

const promotionsSlice = createSlice({
  name: "promotions",
  initialState: { isLoading: true, errMess: null, promotionsArray: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPromotions.pending, (state) => (isLoading = true))
      .addCase(fetchPromotions.fulfilled, (state, action) => {
        state.isLoading = true;
        state.errMess = null;
        state.promotionsArray = action.payload;
      })
      .addCase(fetchPromotions.rejected, (state, action) => {
        state.isLoading = false;
        state.errMess = action.error ? action.error.message : "Fetch failed";
      });
  },
});

export const promotionsReducer = promotionsSlice.reducer;
