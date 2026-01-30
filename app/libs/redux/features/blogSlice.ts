import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../api/api";

// تعريف الـ Interface الخاص بالـ State
interface IBlogState {
  blog: any[]; // مصفوفة المنشورات
  loading: boolean;
  error: any;
}

const initialState: IBlogState = {
  blog: [],
  loading: false,
  error: null,
};

/**
 * 1. Thunk لإنشاء منشور جديد
 * يستخدم FormData لأننا نرسل ملفات (صور)
 */
export const createBlogThunk = createAsyncThunk(
  "blog/createBlog",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/blog/create-blog", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // نرجع البيانات التي أرسلها السيرفر (عادة تحتوي على الـ Blog الجديد)
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

/**
 * 2. Thunk لجلب كل المنشورات
 */
export const getBlogThunk = createAsyncThunk(
  "blog/getBlogs",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/blog/");
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    // يمكنك إضافة Action يدوي هنا لو رغبت في مسح الأخطاء مثلاً
    clearBlogError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      /* --- جلب المنشورات (Get Blogs) --- */
      .addCase(getBlogThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBlogThunk.fulfilled, (state, action) => {
        state.loading = false;
        // هنا نقوم بتخزين المصفوفة القادمة من السيرفر
        // ملاحظة: تأكد إذا كان السيرفر يرسل المصفوفة داخل object اسمه result أو مباشرة
        state.blog = action.payload.result || action.payload; 
        state.error = null;
      })
      .addCase(getBlogThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.blog = [];
      })

      /* --- إنشاء منشور جديد (Create Blog) - التحديث اللحظي --- */
      .addCase(createBlogThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        // ✅ ملاحظة هامة: لا نصفر state.blog هنا لكي تظل المنشورات القديمة ظاهرة
      })
      .addCase(createBlogThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        // استخراج المنشور الجديد من الـ Payload
        const newBlog = action.payload.result || action.payload.blog || action.payload;

        // ✅ إضافة المنشور الجديد فوراً في أول المصفوفة (التحديث اللحظي)
        if (Array.isArray(state.blog)) {
          state.blog.unshift(newBlog);
        } else {
          // في حال كانت الحالة ليست مصفوفة لأي سبب، نحولها لمصفوفة ونضع العنصر
          state.blog = [newBlog];
        }
      })
      .addCase(createBlogThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // ✅ لا نصفر state.blog هنا لكي لا تختفي المنشورات إذا فشل الرفع
      });
  },
});

export const { clearBlogError } = blogSlice.actions;
export default blogSlice.reducer;