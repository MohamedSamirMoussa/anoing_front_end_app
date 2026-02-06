"use client";
import {
  captureWithPaypalThunk,
  donateWithPaypalThunk,
} from "@/app/libs/redux/features/donateSlice";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useDispatch } from "react-redux";
import { IDonate } from "../Donate/Donate";
import toast from "react-hot-toast";

interface IOptions {
  clientId: string;
  currency: "USD";
  intent: "capture";
}

const initialOptions: IOptions = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID as string,
  currency: "USD",
  intent: "capture",
};

console.log(process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID);


const PaypalPayment = ({ theme, data }: { theme: any; data: IDonate }) => {
  const dispatch = useDispatch();
  
  const handleCreateOrder = async () => {
    try {
      const res = await dispatch(donateWithPaypalThunk(data) as any);
      console.log(res);
      
      if (res.payload) {
        return res.payload;
      }
      throw new Error("No Order ID returned");
    } catch (error) {
      console.error("Create Order Error:", error);
      return "";
    }
  };

  const handleApprove = async (data: { orderID: string }) => {
    // 💡 أحياناً بنحتاج ننتظر ثانية لضمان تحديث حالة الأوردر في سيرفرات باي بال
    console.log("User approved the payment, Order ID:", data.orderID);

    // نبعت للباك إند
    const res = await dispatch(captureWithPaypalThunk(data.orderID) as any);
    console.log(res);

    if (res.payload?.status === "COMPLETED") {
      toast.success(res.payload.status);
    } else {
      toast.error("Something went wrong ... Please try again");
    }
  };
  return (
    <PayPalScriptProvider options={initialOptions}>
      <div
        className="max-w-[400px] mx-auto p-6  rounded-2xl shadow-lg"
        style={{ background: theme.gradient }}
      >
        <div className="mb-4 text-center">
          <h3 className="text-2xl font-extrabold font-orbitron">
            Confirm your donation
          </h3>
        </div>

        <PayPalButtons
          style={{
            shape: "pill",
            color: "blue",
            layout: "vertical",
            label: "donate",
          }}
          createOrder={handleCreateOrder}
          onApprove={handleApprove}
        />

        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="text-[10px] uppercase tracking-widest">
            Secure Encryption
          </span>
          <div className="h-px w-8 bg-gray-200"></div>
        </div>
      </div>
    </PayPalScriptProvider>
  );
};

export default PaypalPayment;
