import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../api/api";

export interface ILeaderboard {
  data: [];
  error: any;
  loading: boolean;
}

const initialState: ILeaderboard = {
  data: [],
  error: null,
  loading: false,
};

export const getLeaderboardAtmThunk = createAsyncThunk(
  "leaderboard/atm10",
  async (serverName, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/leaderboard/` , {
        params:{serverName}
      });

      return data;
    } catch (error: any) {
      rejectWithValue(error.payload || error);
    }
  },
);

const leaderboardSlice = createSlice({
  name: "leaderboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLeaderboardAtmThunk.fulfilled, (state, action) => {
        state.data = action.payload;
        state.error = null;
        state.loading = false;
      })
      .addCase(getLeaderboardAtmThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getLeaderboardAtmThunk.rejected, (state, action) => {
        state.error = action.payload || action.error;
      });
  },
});

export default leaderboardSlice.reducer;
