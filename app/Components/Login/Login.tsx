"use client";
import Image from "next/image";
import emailIcon from "../../../public/email.png";
import lockIcon from "../../../public/lock.png";
import { useSelector } from "react-redux";
import { themes } from "@/app/hooks/themes";
import Link from "next/link";
import { FormikProps } from "formik";
import { IFormValues } from "@/app/auth/page";
import { RootState } from "@/app/libs/redux/store";

const Login = ({
  formik,
  activeTab,
}: {
  formik: FormikProps<IFormValues>;
  activeTab: string;
}) => {
  const activeServer = useSelector(
    (state: RootState) => state.theme.activeServer || "Vanilla",
  );
  const theme = themes[activeServer] || themes["Vanilla"];

  if (activeTab !== "Sign in") return null;

  return (
    <div className="login flex flex-col w-full">
      {/* Email Input Group */}
      <div className="w-full mb-4">
        <div
          className="group border border-white/10 rounded-2xl w-full flex items-center bg-white/5 transition-all duration-300 focus-within:ring-1"
          style={{
            // تغيير لون الحدود عند التركيز (Focus) بناءً على الثيم
            borderColor:
              formik.touched.email && !formik.errors.email
                ? theme.color
                : "rgba(255,255,255,0.1)",
          }}
        >
          <label
            htmlFor="email"
            className="pl-4 pr-2 opacity-50 group-focus-within:opacity-100 transition-opacity"
          >
            <Image
              src={emailIcon}
              alt="email icon"
              width={20}
              className="brightness-200"
            />
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email Address"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className="w-full bg-transparent px-4 py-5 outline-none text-white placeholder:text-gray-500 rounded-2xl"
          />
        </div>
        {formik.touched.email && formik.errors.email && (
          <p className="text-red-500 text-xs mt-2 ml-2 font-medium">
            {formik.errors.email}
          </p>
        )}
      </div>

      {/* Password Input Group */}
      <div className="w-full mb-2">
        <div
          className="group border border-white/10 rounded-2xl w-full flex items-center bg-white/5 transition-all duration-300 focus-within:ring-1"
          style={{
            borderColor:
              formik.touched.password && !formik.errors.password
                ? theme.color
                : "rgba(255,255,255,0.1)",
          }}
        >
          <label
            htmlFor="password"
            className="pl-4 pr-2 opacity-50 group-focus-within:opacity-100 transition-opacity"
          >
            <Image
              src={lockIcon}
              alt="lock icon"
              width={20}
              className="brightness-200"
            />
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            className="w-full bg-transparent px-4 py-5 outline-none text-white placeholder:text-gray-500 rounded-2xl"
          />
        </div>
        {formik.touched.password && formik.errors.password && (
          <p className="text-red-500 text-xs mt-2 ml-2 font-medium">
            {formik.errors.password}
          </p>
        )}
      </div>

      {/* Forgot Password Link */}
      <div className="flex justify-end mb-4">
        <Link
          href="/forgetPassword"
          className="text-xs text-gray-500 hover:text-white transition-colors"
          style={{ color: theme.color + "CC" }} // تقليل شفافية اللون قليلاً
        >
          Forgot Password?
        </Link>
      </div>
    </div>
  );
};

export default Login;
