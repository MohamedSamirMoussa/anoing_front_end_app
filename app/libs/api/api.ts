import axios from "axios";

console.log(process.env.NEXT_PUBLIC_BACK_END_URI)

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACK_END_URI}/api/v1`,
  withCredentials: true,
});

