import axios from "axios";
import { store } from "../redux/store";
import { refreshAuthThunk } from "../redux/features/authSlice";

export const api = axios.create({
  baseURL: "https://anoing-app.vercel.app/api/v1",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
    }

    try {
      const result = await store.dispatch(refreshAuthThunk());

      if (refreshAuthThunk.fulfilled.match(result)) {
        const newToken = result.payload.access_token;
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

        return api(originalRequest);
      }
    } catch (err) {
      return Promise.reject(err);
    }
    return Promise.reject(error);
  },
);
