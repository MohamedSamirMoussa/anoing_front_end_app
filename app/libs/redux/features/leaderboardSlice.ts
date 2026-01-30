import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../api/api";
import { handleThunkError } from "@/app/hooks/handlingErr";

interface LeaderboardResult {
  result?: {
    leaderboard: any[];
  };
}

export interface ILeaderboard {
  data: LeaderboardResult | null;
  error: any;
  loading: boolean;
}

const initialState: ILeaderboard = {
  data: null,
  error: null,
  loading: false,
};
export const getLeaderboardAtmThunk = createAsyncThunk(
  "leaderboard/atm10",
  async (serverName: string, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/leaderboard/`, {
        params: { serverName },
      });

      return data;
    } catch (error: unknown) {
      return handleThunkError(error, rejectWithValue);
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
