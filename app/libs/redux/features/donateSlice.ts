import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import  api  from "../../api/api";
import { IDonate } from "@/app/Components/Donate/Donate";
import { handleThunkError } from "@/app/hooks/handlingErr";

interface DonateState {
  isLoading: boolean;
  error: any;
  orderData: any;
}

const initialState: DonateState = {
  isLoading: false,
  error: null,
  orderData: null,
};

export const donateWithPaypalThunk = createAsyncThunk(
  "donate/paypal",
  async (paymentData: IDonate, { rejectWithValue }) => {
    try {
      const { data } = await api.post(
        "/checkout/paypal",
        paymentData ,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      return data.result;
    } catch (error: unknown) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

export const captureWithPaypalThunk = createAsyncThunk<string, any>(
  "paypal/capture",
  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/checkout/paypal/${orderId}`);
      return data.result;
    } catch (error: unknown) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

const donateSlice = createSlice({
  name: "donate",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(donateWithPaypalThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(donateWithPaypalThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderData = action.payload;
      })
      .addCase(donateWithPaypalThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(captureWithPaypalThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(captureWithPaypalThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderData = action.payload;
      })
      .addCase(captureWithPaypalThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default donateSlice.reducer;
