import { getOrdersApi } from '../../utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '../../utils/types';

export const fetchUserOrders = createAsyncThunk(
  'userOrders/fetchUserOrders',
  getOrdersApi
);

interface UserOrdersState {
  orders: TOrder[];
  loading: boolean;
  error: string | null;
}

const initialState: UserOrdersState = {
  orders: [],
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
      });
  }
});

export default userOrdersSlice.reducer;
