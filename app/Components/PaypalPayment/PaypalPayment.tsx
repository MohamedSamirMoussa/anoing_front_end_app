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
  clientId:string
  currency:"USD"
  intent:"capture"
}

const initialOptions:IOptions = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID as string,
  currency: "USD",
  intent: "capture",
};

const PaypalPayment = ({ amount }: { amount: IDonate }) => {
  const dispatch = useDispatch();
  const handleCreateOrder = async () => {
    try {
      
      const res = await dispatch(donateWithPaypalThunk(amount) as any);

      if (res.payload) {
        return res.payload;
      }
      throw new Error("No Order ID returned");
    } catch (error) {
      console.error("Create Order Error:", error);
      return "";
    }
  };

const handleApprove = async (data:{orderID:string}) => {
  // 💡 أحياناً بنحتاج ننتظر ثانية لضمان تحديث حالة الأوردر في سيرفرات باي بال
  console.log("User approved the payment, Order ID:", data.orderID);
  
  // نبعت للباك إند
  const res = await dispatch(captureWithPaypalThunk(data.orderID) as any);
  console.log(res);
  
  if (res.payload?.status === "COMPLETED") {
     toast.success(res.payload.status)
  } else {
    toast.error('Something went wrong ... Please try again')
  }
};
  return (
    <PayPalScriptProvider options={initialOptions}>
      <div className="">
        <PayPalButtons
          style={{ shape: "rect", layout: "vertical" }}
          createOrder={handleCreateOrder}
          onApprove={handleApprove}
          onError={(err) => {
            console.log("PayPal Button Error:", err);
          }}
        />
      </div>
    </PayPalScriptProvider>
  );
};

export default PaypalPayment;
