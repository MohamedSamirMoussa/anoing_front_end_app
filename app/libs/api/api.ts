import axios from "axios";
import { refreshAuthThunk } from "../redux/features/authSlice";

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACK_END_URI}/api/v1`,
  withCredentials: true,
});

// متغير وسيط لتخزين الـ store
let store: any;
export const injectStore = (_store: any) => {
  store = _store;
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (!store) return Promise.reject(error);
        
        const result = await store.dispatch(refreshAuthThunk());

        if (refreshAuthThunk.fulfilled.match(result)) {
          const newToken = result.payload.access_token;
          if (newToken) {
             originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          }
          return api(originalRequest);
        }
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);