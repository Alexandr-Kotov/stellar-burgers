import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  getUserApi,
  updateUserApi,
  TRegisterData
} from '../../utils/burger-api';
import { TUser } from '../../utils/types';

export interface ProfileState {
  user: TUser | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProfileState = {
  user: null,
  status: 'idle',
  error: null
};

export const fetchUser = createAsyncThunk<TUser, void, { rejectValue: string }>(
  'profile/fetchUser',
  async (_, thunkAPI) => {
    try {
      const res = await getUserApi();
      return res.user;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message || 'Ошибка при загрузке пользователя');
    }
  }
);

export const updateUser = createAsyncThunk<
  TUser,
  Partial<TRegisterData>,
  { rejectValue: string }
>('profile/updateUser', async (data, thunkAPI) => {
  try {
    const res = await updateUserApi(data);
    return res.user;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message || 'Ошибка при обновлении пользователя');
  }
});

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfile(state) {
      state.user = null;
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Ошибка при загрузке пользователя';
      })
      .addCase(updateUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Ошибка при обновлении пользователя';
      });
  }
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
