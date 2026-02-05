import axios from "axios";
import toast from "react-hot-toast";

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

    if (status === 401 || status === 403) {
      
      localStorage.clear();

      if (method !== 'get') {
        if (!isToastActive) {
          isToastActive = true;
          toast.error("انتهت الجلسة، سجل دخول عشان تنفذ العملية دي", {
            onClose: () => { isToastActive = false; } // نصفر الـ flag لما الرسالة تختفي
          });
          window.location.href = "/auth";
        }
      } 
      else {
        console.warn("Silent failure: User is browsing with expired session");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
