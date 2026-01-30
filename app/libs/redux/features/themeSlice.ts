import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ServerState {
  activeServer: string;
}

const initialState: ServerState = {
  activeServer: "atm 10",
};

export const themeSlice = createSlice({
  name: 'server',
  initialState,
  reducers: {
    setActiveServer: (state, action: PayloadAction<string>) => {
      state.activeServer = action.payload;
    },
  },
});

export const { setActiveServer } = themeSlice.actions;
export default themeSlice.reducer;