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
import "./Donate.css";
export interface IDonate {
  amount: {
    currency_code: "USD";
    value: string;
  };
  username: string;
}

const initialValues: IDonate = {
  amount: {
    currency_code: "USD",
    value: "",
  },
  username: "",
};

const validationSchema = Yup.object({
  value: Yup.number()
    .typeError("Value must be a number")
    .required("Value is required")
    .positive("Value must be greater than 0"),
  username: Yup.string().required("Please enter your minecraft's username"),
});

const quickAmount = ["10", "50", "100", "300"];

const Donate = () => {
  const activeTab = useSelector(
    (state: RootState) => state.theme.activeServer || "atm 10",
  );
  const theme = themes[activeTab] || themes["atm 10"];
  const [hidden, setHidden] = useState<boolean>(true);

  const handleDonateBtn = () => setHidden(!hidden);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values: IDonate) => console.log(values),
  });

  const isValidAmount = Number(formik.values.amount.value) > 0;

  return (
    <>
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

          <div className="quick-amount flex justify-center items-center gap-2 my-2">
            <div className="grid grid-cols-4 gap-4">
              {quickAmount.map((amt: string) => (
                <button
                  key={amt}
                  onClick={() => formik.setFieldValue("amount.value", amt)}
                  className="py-3 px-1 rounded-xl w-full bg-[#1a1a25]"
                >
                  ${amt}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-3 mb-6">
            <div className="flex flex-col gap-3">
              <div>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="minecraft's username"
                  className="bg-[#1a1a25] border border-[#ffffff10] py-3 px-4 rounded-xl w-24 text-center text-gray-400 w-full"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              <div className="relative flex-1">
                <input
                  type="text"
                  id="amount.value"
                  name="amount.value"
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
                  value={formik.values.amount.value}
                />
                <span className="absolute right-4 top-3 text-gray-500">$</span>
              </div>
            </div>
            <input
              type="text"
              className="bg-[#1a1a25] border border-[#ffffff10] py-3 px-4 rounded-xl w-24 text-center text-gray-400"
              disabled
              value={formik.values.amount.currency_code}
            />
          </div>

          <div key={formik.values.amount.value} className="min-h-[150px]">
            {isValidAmount ? (
              <div className="animate-fade-in">
                <PaypalPayment theme={theme} data={formik.values} />
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
