import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../api/api";

interface ThemeState {
  activeServer: string;
  dynamicTexts: { [key: string]: string }; // مصفوفة كائنات لتعيين نص لكل سيرفر
  isLoading: boolean;
  error: string | null;
}

export const updateThemeTextThunk = createAsyncThunk(
  "theme/updateText",
  async (
    { server, text }: { server: string; text: string },
    { rejectWithValue }
  ) => {
    try {
      // التأكد من أن المسار يطابق ما بنيناه في الباك إند
      const response = await api.put("/update-theme-text", { server, text });
      return { server, text: response.data.result };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Update failed");
    }
  }
);

const superSlice = createSlice({
  name: "theme",
  initialState: {
    activeServer: "Vanilla",
    dynamicTexts: {},
    isLoading: false,
    error: null,
  } as ThemeState,
  reducers: {
    setActiveServer: (state, action: PayloadAction<string>) => {
      state.activeServer = action.payload;
    },
    setAllDynamicTexts: (state, action: PayloadAction<{ [key: string]: string }>) => {
      state.dynamicTexts = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateThemeTextThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateThemeTextThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const { server, text } = action.payload;
        // تحديث الحالة فوراً لتنعكس في الواجهة
        state.dynamicTexts[server] = text;
      })
      .addCase(updateThemeTextThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setActiveServer, setAllDynamicTexts } = superSlice.actions;
export default superSlice.reducer;