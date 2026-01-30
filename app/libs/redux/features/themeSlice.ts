import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ServerState {
  activeServer: string;
}

const initialState: ServerState = {
  activeServer: "Vanilla",
};

export const serverSlice = createSlice({
  name: 'server',
  initialState,
  reducers: {
    setActiveServer: (state, action: PayloadAction<string>) => {
      state.activeServer = action.payload;
    },
  },
});

export const { setActiveServer } = serverSlice.actions;
export default serverSlice.reducer;