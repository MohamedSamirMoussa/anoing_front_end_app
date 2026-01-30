import axios from "axios";
// ❌ احذف هذا السطر فوراً: import { store } from "../redux/store";
import { refreshAuthThunk } from "../redux/features/authSlice";

export const api = axios.create({
  baseURL: `${process.env.BACK_END_URI}/api/v1`,
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

    // 1. منع الحلقة المفرغة: لا تحاول التجديد إذا كان الطلب أصلاً رايح لـ refresh
    if (originalRequest.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // نستخدم الـ store المحقون وليس المستورد
        if (!store) return Promise.reject(error);
        
        const result = await store.dispatch(refreshAuthThunk());

        if (refreshAuthThunk.fulfilled.match(result)) {
          // إذا كنت تستخدم JWT في الهيدر
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