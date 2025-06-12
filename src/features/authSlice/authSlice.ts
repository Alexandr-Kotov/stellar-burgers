import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  TLoginData,
  TRegisterData,
  loginUserApi,
  registerUserApi,
  logoutApi
} from '../../utils/burger-api';
import { setCookie, deleteCookie } from '../../utils/cookie';
import { clearProfile, fetchUser } from '../profileSlice/profileSlice';

interface AuthState {
  loading: boolean;
  error: string | null;
  logoutLoading: boolean;
  logoutError: string | null;
}

const initialState: AuthState = {
  loading: false,
  error: null,
  logoutLoading: false,
  logoutError: null
};

export const registerUser = createAsyncThunk<
  void,
  TRegisterData,
  { rejectValue: string }
>('auth/register', async (data, thunkAPI) => {
  try {
    const res = await registerUserApi(data);
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    thunkAPI.dispatch(fetchUser());
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message || 'Ошибка регистрации');
  }
});

export const loginUser = createAsyncThunk<
  void,
  TLoginData,
  { rejectValue: string }
>('auth/login', async (data, thunkAPI) => {
  try {
    const res = await loginUserApi(data);
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    thunkAPI.dispatch(fetchUser());
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message || 'Ошибка входа');
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logout',
  async (_, thunkAPI) => {
    try {
      await logoutApi();
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      thunkAPI.dispatch(clearProfile());
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message || 'Ошибка выхода');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка регистрации';
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка входа';
      })
      .addCase(logoutUser.pending, (state) => {
        state.logoutLoading = true;
        state.logoutError = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.logoutLoading = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.logoutLoading = false;
        state.logoutError = action.payload || 'Ошибка выхода';
      });
  }
});

export default authSlice.reducer;
