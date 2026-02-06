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
    const url = error.config?.url || "" ;   
    if (status === 401 || status === 403) {
      
      if (!url.includes("donate") && !url.includes("paypal")) {
        
        localStorage.clear();
        store.dispatch(logout());

        if (method !== "get") {
          if (!isToastActive) {
            isToastActive = true;
            toast.error("Your session has expired, please login again", {
              duration: 3000,
            });

            setTimeout(() => {
              isToastActive = false;
              window.location.href = "/auth";
            }, 2000);
          }
        } else {
          console.warn("Silent failure: User is browsing with expired session");
        }
      } else {
        console.error("PayPal/Donate Auth Error: Check Backend PayPal Credentials");
      }
    }

    return Promise.reject(error);
  },
);
export default api;
