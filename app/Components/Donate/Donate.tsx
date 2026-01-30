"use client";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import PaypalPayment from "../PaypalPayment/PaypalPayment";
import { useFormik } from "formik";
import { themes } from "@/app/hooks/themes";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { RootState } from "@/app/libs/redux/store";
import './Donate.css'
export interface IDonate {
  currency_code: "USD";
  value: string;
}

const initialValues: IDonate = {
  currency_code: "USD",
  value: "",
};

const validationSchema = Yup.object({
  value: Yup.number()
    .typeError("Value must be a number")
    .required("Value is required")
    .positive("Value must be greater than 0"),
});

const Donate = () => {
  const activeTab = useSelector(
    (state: RootState) => state.theme.activeServer || "Vanilla",
  );
  const theme = themes[activeTab] || themes["Vanilla"];
  const [hidden, setHidden] = useState<boolean>(true);

  const handleDonateBtn = () => setHidden(!hidden);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values: IDonate) => console.log(values),
  });

  // التأكد من أن القيمة رقم صالح وأكبر من صفر
  const isValidAmount = Number(formik.values.value) > 0;

  return (
    <>
      {/* زر القلب العائم - أضفنا animate-floating */}
      <div className="fixed bottom-10 left-10 z-30">
        <button
          className="bg-rose-600 heart py-1 pe-2 relative overflow-hidden w-12 hover:w-full flex justify-start  items-center rounded-full shadow-lg hover:scale-110 animate-floating transition-all duration-300"
          onClick={handleDonateBtn}
        >
          <span className="">
            <FontAwesomeIcon
              icon={faHeart}
              className="text-2xl text-white heart px-2"
            />
          </span>
        </button>
      </div>

      <div
        onClick={(e) => e.target === e.currentTarget && setHidden(true)}
        className={`card h-screen w-screen flex justify-center items-center text-white fixed top-0 left-0 bg-[#000000aa] backdrop-blur-sm z-50 transition-all duration-500 ${
          hidden ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <form
          onSubmit={formik.handleSubmit}
          className="p-8 rounded-3xl border border-[#ffffff20] bg-[#0f0f15] shadow-2xl w-full max-w-md mx-4"
        >
          <h2
            className="text-2xl font-bold mb-6 text-center font-orbitron"
            style={{
              backgroundImage: theme?.gradient,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Support Our Server
          </h2>

          <div className="flex gap-3 mb-6">
            <div className="relative flex-1">
              <input
                type="text" // تغيير لـ number لضمان مدخلات صحيحة
                id="value"
                name="value"
                placeholder="0.00"
                /**/
                className={`bg-[#1a1a25] border border-[#ffffff10] py-3 px-4 rounded-xl w-full focus:outline-none focus:border-rose-600 transition-colors ${formik.errors.value && formik.touched.value ? "border-red-500" : ""}`}
                onChange={(e) => {
                  const regex = /^[0-9\b]+$/;
                  if (e.target.value === "" || regex.test(e.target.value)) {
                    formik.handleChange(e);
                  }
                }}
                onBlur={formik.handleBlur}
                value={formik.values.value}
              />
              <span className="absolute right-4 top-3 text-gray-500">$</span>
            </div>

            <input
              type="text"
              className="bg-[#1a1a25] border border-[#ffffff10] py-3 px-4 rounded-xl w-24 text-center text-gray-400"
              disabled
              value={formik.values.currency_code}
            />
          </div>

          {/* تظهر أزرار PayPal فقط إذا كانت القيمة صالحة */}
          <div key={formik.values.value} className="min-h-[150px]">
            {isValidAmount ? (
              <div className="animate-fade-in">
                <PaypalPayment
                  amount={{
                    currency_code: "USD",
                    value: formik.values.value,
                  }}
                />
              </div>
            ) : (
              <div className="text-center text-gray-500 py-10 border-2 border-dashed border-[#ffffff10] rounded-xl">
                Please enter a valid amount to donate
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setHidden(true)}
            className="w-full mt-4 text-gray-500 hover:text-white transition-colors text-sm"
          >
            Cancel
          </button>
        </form>
      </div>
    </>
  );
};

export default Donate;
