import { getOrderByNumberApi, getOrdersApi } from '../../utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '../../utils/types';

export const fetchUserOrders = createAsyncThunk(
  'userOrders/fetchUserOrders',
  getOrdersApi
);

export const fetchUserOrderByNumber = createAsyncThunk(
  'userOrders/fetchUserOrderByNumber',
  async (number: number, { rejectWithValue }) => {
    try {
      const res = await getOrderByNumberApi(number);
      return res.orders[0];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load order');
    }
  }
);

interface UserOrdersState {
  orders: TOrder[];
  currentOrder: TOrder | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserOrdersState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null
};

const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load orders';
      })
      .addCase(fetchUserOrderByNumber.pending, (state) => {
        state.loading = true;
        state.currentOrder = null;
      })
      .addCase(fetchUserOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchUserOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load order';
      });
  }
});

export default userOrdersSlice.reducer;
