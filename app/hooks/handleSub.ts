import toast from "react-hot-toast";
import { successHandler } from "./successHandler";
import { ErrorHandler } from "./handleErr";
import { FormikValues } from "formik";
import { AppDispatch } from "../libs/redux/store";
import { Router } from "next/router";
export const Onsubmit = async (
  values: FormikValues,
  helpers: () => void,
  fnThunk: any,
  dispatch: AppDispatch,
  router?:Router,
  path?:string
) => {

  const res = await dispatch(fnThunk(values));

  if (res.meta.requestStatus === "rejected") {
    toast.error(ErrorHandler(res));
  }
  if (res.meta.requestStatus === "fulfilled") {
    helpers();
    toast.success(successHandler(res));
    router?.push(path as string)
  }

  return res;
};
