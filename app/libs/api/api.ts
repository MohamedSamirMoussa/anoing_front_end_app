import axios from "axios";
import toast from "react-hot-toast";

console.log(process.env.NEXT_PUBLIC_BACK_END_URI);

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACK_END_URI}/api/v1`,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response.status;
    if (
      (typeof window !== "undefined" && error.response && status === 401) ||
      403
    ) {
      localStorage.clear();
      toast.error("Your session are expired please try login again", {
        duration: 4000,
        position: "top-center",
        style: {
          borderRadius: "12px",
          background: "#333",
          color: "#fff",
        },
      });

      window.location.href = "/auth";
    }
    return Promise.reject(error);
  },
);

export default api;
