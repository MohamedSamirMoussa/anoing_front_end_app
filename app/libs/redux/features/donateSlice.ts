import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../api/api";
import { IDonate } from "@/app/Components/Donate/Donate";

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
  async (amount: IDonate, { rejectWithValue }) => {
    try {
      const {data} = await api.post(
        "/checkout/paypal",
        { amount },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      return data.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const captureWithPaypalThunk = createAsyncThunk<string , any>(
  "paypal/capture",
  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/checkout/paypal/${orderId}`);
      console.log(data)
      return data.result;
    } catch (error) {
      console.log(error);
      
      return rejectWithValue(error.response?.data || error.message);
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
