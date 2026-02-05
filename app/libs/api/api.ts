import axios from "axios";
import toast from "react-hot-toast";
import { store } from "../redux/store";
import { logout } from "../redux/features/authSlice";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACK_END_URI}/api/v1`,
  withCredentials: true,
});

let isToastActive = false;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const method = error.config?.method;
    localStorage.clear();
    if (status === 401 || status === 403) {
      if (method !== "get") {
        if (!isToastActive) {
          isToastActive = true;
          
          toast.error("Your session has expired, please login again", {
            duration: 3000,
          });
          store.dispatch(logout());

          setTimeout(() => {
            isToastActive = false;
            window.location.href = "/auth";
          }, 2000);
        }
      } else {
        console.warn("Silent failure: User is browsing with expired session");
      }
    }

    return Promise.reject(error);
  },
);

export default api;
