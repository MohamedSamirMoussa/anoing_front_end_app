import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import  api  from "../../api/api";
import { handleThunkError } from "@/app/hooks/handlingErr";

// 1. تحسين تعريف الأنواع (Interfaces) لجعل الكود أكثر أماناً
interface IBlog {
  _id: string;
  title: string;
  description: string;
  image: {
    secure_url: string;
  };
  createdAt: string;
  [key: string]: any; 
}

interface IBlogState {
  blog: IBlog[];
  loading: boolean;
  error: any;
}

const initialState: IBlogState = {
  blog: [],
  loading: false,
  error: null,
};

// --- Thunks ---

export const createBlogThunk = createAsyncThunk(
  "blog/createBlog",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/blog/create-blog", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    } catch (error: unknown) {
      return handleThunkError(error, rejectWithValue);
    }
  }
);

export const getBlogThunk = createAsyncThunk(
  "blog/getBlogs",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/blog/");
      return data;
    } catch (error: unknown) {
      return handleThunkError(error, rejectWithValue);
    }
  }
);

// --- Slice ---

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    clearBlogError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // جلب المدونات
      .addCase(getBlogThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBlogThunk.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        // التأكد من استخراج البيانات بشكل صحيح حسب شكل الـ API
        state.blog = action.payload?.result || action.payload?.blogs || action.payload || []
        state.error = null;
      })
      .addCase(getBlogThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // إنشاء مدونة جديدة
      .addCase(createBlogThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBlogThunk.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = null;

        // استخراج الكائن الجديد
        const newBlog = action.payload.result || action.payload.blog || action.payload;

        // إضافة المنشور الجديد في بداية المصفوفة (Unshift)
        if (newBlog) {
          state.blog = [newBlog, ...state.blog];
        }
      })
      .addCase(createBlogThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBlogError } = blogSlice.actions;
export default blogSlice.reducer;