import { createAsyncThunk, createSlice, UnknownAction } from "@reduxjs/toolkit";
import { api } from "../../api/api";
import { IGoogleUser } from "@/app/Components/GoogleButton/GoogleButton";
import { IConfirmInterface } from "@/app/confirmPassword/page";
import { IResetPass } from "@/app/newPassword/page";
import { IFormValues } from "@/app/auth/page";
import { handleThunkError } from "@/app/hooks/handlingErr";

interface IUser {
  id: string;
  username: string;
  email: string;
  gender?: string;
  [key: string]: any;
}

export interface IAuthState {
  user: IUser | null;
  loading: boolean;
  error: any;
  isLogged: boolean;
  discordUrl: string | null;
  token: string;
}

const initialState: IAuthState = {
  user: null,
  loading: false,
  error: null,
  isLogged: false,
  discordUrl: null,
  token: "",
};

export const loginThunk = createAsyncThunk<
  any,
  { email: string; password: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  } catch (error: unknown) {
    return handleThunkError(error, rejectWithValue);
  }
});

export const confirmEmailThunk = createAsyncThunk<any, IConfirmInterface>(
  "auth/confirm-email",
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/confirm-email", values);
      return data;
    } catch (error: unknown) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

export const registerThunk = createAsyncThunk<any, IFormValues>(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error: unknown) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

export const forgetPasswordThunk = createAsyncThunk<any, { email: string }>(
  "forgetPassword/auth",
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/forget-password", values);
      return data;
    } catch (error: unknown) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

export const confirmPasswordThunk = createAsyncThunk<any, IConfirmInterface>(
  "confirmPassword/auth",
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/confirm-password", values);

      return data;
    } catch (error:unknown) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);
export const newPasswordThunk = createAsyncThunk<any, IResetPass>(
  "resetPassword/auth",
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/reset-password", values);

      return data;
    } catch (error: unknown) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

export const signinWithGoogleThunk = createAsyncThunk<any, IGoogleUser>(
  "signinWithGoogle/auth",
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/google-login", values);
      return data;
    } catch (error: unknown) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

export const getDiscordRedirect = createAsyncThunk<any, any>(
  "auth/getDiscordRedirect",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/auth/discord");
      return data;
    }  catch (error: unknown) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

export const checkAuthThunk = createAsyncThunk<any, any>(
  "checkAuth/auth",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.post(
        "/auth/check-auth",
        {},
        { withCredentials: true },
      );
      return data;
    } catch (error: unknown) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

export const resendOtpThunk = createAsyncThunk<any, { email: string }>(
  "resendOtp/auth",
  async ({ email }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/resend-otp", { email });

      return data;
    } catch (error: unknown) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

export const logoutThunk = createAsyncThunk<any, any>(
  "auth/logout",
  async (_, { rejectWithValue }: { rejectWithValue?: any }) => {
    try {
      const { data } = await api.post(
        "/auth/logout",
        {},
        { withCredentials: true },
      );
      return data;
    } catch (error: unknown) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.isLogged = false;
      state.user = null;
    },
    login(state) {
      state.isLogged = true;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(loginThunk.fulfilled, (state, action) => {
        state.user = action.payload.result || action.payload;
        state.isLogged = true;
      })
      .addCase(signinWithGoogleThunk.fulfilled, (state, action) => {
        state.user = action.payload.result || action.payload;
        state.isLogged = true;
      })

      .addCase(checkAuthThunk.fulfilled, (state, action) => {
        state.user = action.payload.result || action.payload;
        state.isLogged = true;
      })

      .addCase(getDiscordRedirect.fulfilled, (state, action) => {
        state.discordUrl = action.payload.result || action.payload;
        state.isLogged = true;
      })

      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.isLogged = false;
      })

      .addMatcher(
        (action: UnknownAction) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )
      .addMatcher(
        (action: UnknownAction) =>
          action.type.endsWith("/fulfilled") ||
          action.type.endsWith("/rejected"),
        (state) => {
          state.loading = false;
        },
      )
      .addMatcher(
        (action: UnknownAction) => action.type.endsWith("/rejected"),
        (state, action: any) => {
          state.error = action.payload;
          // إذا فشل الـ checkAuth، نلغي حالة التسجيل فوراً
          if (action.type.includes("checkAuth")) {
            state.isLogged = false;
            state.user = null;
          }
        },
      );
  },
});

export const { logout, login } = authSlice.actions;
export default authSlice.reducer;
