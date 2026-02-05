import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";
import { handleThunkError } from "@/app/hooks/handlingErr";

export interface ILeaderboard {
  data: any | null;
  searchResults: any[];
  loading: boolean;
  searchLoading: boolean;
  error: any;
  all: [];
}

const initialState: ILeaderboard = {
  data: null,
  searchResults: [],
  loading: false,
  searchLoading: false,
  error: null,
  all: [],
};
export const getLeaderboardThunk = createAsyncThunk(
  "leaderboard/atm10",
  async (serverName: any, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/leaderboard/", {
        params: { serverName },
      });

      return data;
    } catch (error: unknown) {
      console.log(error);

      return handleThunkError(error, rejectWithValue);
    }
  },
);

export const searchbarThunk = createAsyncThunk(
  "search/leaderboard",
  async ({ username }: { username: string }, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/leaderboard/search", {
        params: { username },
      });
      return data;
    } catch (error: unknown) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

export const getAllLeaderboards = createAsyncThunk(
  "getLeaderboards/leaderboard",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/leaderboard/allServers", {
        withCredentials: true,
      });

      return data;
    } catch (error) {
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
      .addCase(getLeaderboardThunk.fulfilled, (state, action) => {
        state.data = action.payload;
        state.error = null;
        state.loading = false;
      })
      .addCase(getLeaderboardThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getLeaderboardThunk.rejected, (state, action) => {
        state.error = action.payload || action.error;
      })
      .addCase(searchbarThunk.pending, (state) => {
        state.searchLoading = true;
      })
      .addCase(searchbarThunk.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload.result?.searchResult || [];
      })
      .addCase(searchbarThunk.rejected, (state) => {
        state.searchLoading = false;
        state.searchResults = [];
      })
      .addCase(getAllLeaderboards.fulfilled, (s, act) => {
        s.all = act.payload || act.payload.all;
        s.error = null;
        s.loading = false;
      })
      .addCase(getAllLeaderboards.rejected, (s, act) => {
        s.all = [];
        s.error = act.payload;
        s.loading = false;
      })
      .addCase(getAllLeaderboards.pending, (s) => {
        s.all = [];
        s.error = null;
        s.loading = true;
      });
  },
});

export default leaderboardSlice.reducer;
