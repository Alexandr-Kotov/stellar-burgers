import reducer, {
  registerUser,
  loginUser,
  logoutUser
} from '../src/features/authSlice/authSlice';
import { configureStore } from '@reduxjs/toolkit';
import * as api from '../src/utils/burger-api';
import { setCookie } from '../src/utils/cookie';

jest.mock('../src/utils/cookie', () => ({
  setCookie: jest.fn(),
  deleteCookie: jest.fn()
}));

// @ts-ignore
global.localStorage = {
  setItem: jest.fn(),
  removeItem: jest.fn()
};

const initialState = {
  loading: false,
  error: null,
  logoutLoading: false,
  logoutError: null
};

afterEach(() => {
  jest.restoreAllMocks();
});

describe('authSlice reducer', () => {
  describe('registerUser reducers', () => {
    it('ставит loading true при pending', () => {
      const action = { type: registerUser.pending.type };
      const state = reducer(initialState, action);
      expect(state).toEqual({ ...initialState, loading: true, error: null });
    });

    it('ставит loading false при fulfilled', () => {
      const action = { type: registerUser.fulfilled.type };
      const state = reducer({ ...initialState, loading: true }, action);
      expect(state).toEqual({ ...initialState, loading: false });
    });

    it('записывает ошибку и loading false при rejected', () => {
      const action = {
        type: registerUser.rejected.type,
        payload: 'Ошибка регистрации'
      };
      const state = reducer({ ...initialState, loading: true }, action);
      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: 'Ошибка регистрации'
      });
    });
  });

  describe('loginUser reducers', () => {
    it('ставит loading true при pending', () => {
      const action = { type: loginUser.pending.type };
      const state = reducer(initialState, action);
      expect(state).toEqual({ ...initialState, loading: true, error: null });
    });

    it('ставит loading false при fulfilled', () => {
      const action = { type: loginUser.fulfilled.type };
      const state = reducer({ ...initialState, loading: true }, action);
      expect(state).toEqual({ ...initialState, loading: false });
    });

    it('записывает ошибку и loading false при rejected', () => {
      const action = {
        type: loginUser.rejected.type,
        payload: 'Ошибка входа'
      };
      const state = reducer({ ...initialState, loading: true }, action);
      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: 'Ошибка входа'
      });
    });
  });

  describe('logoutUser reducers', () => {
    it('ставит logoutLoading true при pending', () => {
      const action = { type: logoutUser.pending.type };
      const state = reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        logoutLoading: true,
        logoutError: null
      });
    });

    it('ставит logoutLoading false при fulfilled', () => {
      const action = { type: logoutUser.fulfilled.type };
      const state = reducer({ ...initialState, logoutLoading: true }, action);
      expect(state).toEqual({ ...initialState, logoutLoading: false });
    });

    it('записывает ошибку и logoutLoading false при rejected', () => {
      const action = {
        type: logoutUser.rejected.type,
        payload: 'Ошибка выхода'
      };
      const state = reducer({ ...initialState, logoutLoading: true }, action);
      expect(state).toEqual({
        ...initialState,
        logoutLoading: false,
        logoutError: 'Ошибка выхода'
      });
    });
  });
});

describe('async thunk registerUser', () => {
  it('диспатчит fulfilled и сохраняет токены', async () => {
    const mockResponse = {
      success: true,
      accessToken: 'mockAccess',
      refreshToken: 'mockRefresh',
      user: { name: 'Test User', email: 'test@example.com' }
    };

    jest.spyOn(api, 'registerUserApi').mockResolvedValue(mockResponse);

    const store = configureStore({ reducer });

    const result = await store.dispatch(
      registerUser({ email: 'test@test.com', password: '123456', name: 'Test' })
    );

    expect(result.type).toBe(registerUser.fulfilled.type);
    expect(setCookie).toHaveBeenCalledWith('accessToken', 'mockAccess');
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'refreshToken',
      'mockRefresh'
    );
  });

  it('возвращает ошибку при отклонении', async () => {
    jest
      .spyOn(api, 'registerUserApi')
      .mockRejectedValue(new Error('Ошибка регистрации'));

    const store = configureStore({ reducer });

    const result = await store.dispatch(
      registerUser({ email: 'bad@test.com', password: '123', name: 'Bad' })
    );

    expect(result.type).toBe(registerUser.rejected.type);
    expect(result.payload).toBe('Ошибка регистрации');
  });
});

describe('async thunk loginUser', () => {
  it('диспатчит fulfilled и сохраняет токены', async () => {
    const mockResponse = {
      success: true,
      accessToken: 'mockAccessLogin',
      refreshToken: 'mockRefreshLogin',
      user: { name: 'User Login', email: 'login@example.com' }
    };

    jest.spyOn(api, 'loginUserApi').mockResolvedValue(mockResponse);

    const store = configureStore({ reducer });

    const result = await store.dispatch(
      loginUser({ email: 'login@test.com', password: '123456' })
    );

    expect(result.type).toBe(loginUser.fulfilled.type);
    expect(setCookie).toHaveBeenCalledWith('accessToken', 'mockAccessLogin');
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'refreshToken',
      'mockRefreshLogin'
    );
  });

  it('возвращает ошибку при отклонении', async () => {
    jest
      .spyOn(api, 'loginUserApi')
      .mockRejectedValue(new Error('Ошибка входа'));

    const store = configureStore({ reducer });

    const result = await store.dispatch(
      loginUser({ email: 'fail@test.com', password: 'wrong' })
    );

    expect(result.type).toBe(loginUser.rejected.type);
    expect(result.payload).toBe('Ошибка входа');
  });
});

describe('async thunk logoutUser', () => {
  it('диспатчит fulfilled и очищает токены', async () => {
    jest.spyOn(api, 'logoutApi').mockResolvedValue({ success: true });

    const store = configureStore({ reducer });

    const result = await store.dispatch(logoutUser());

    expect(result.type).toBe(logoutUser.fulfilled.type);
    expect(localStorage.removeItem).toHaveBeenCalledWith('refreshToken');
    expect(require('../src/utils/cookie').deleteCookie).toHaveBeenCalledWith(
      'accessToken'
    );
  });

  it('возвращает ошибку при отклонении', async () => {
    jest.spyOn(api, 'logoutApi').mockRejectedValue(new Error('Ошибка выхода'));

    const store = configureStore({ reducer });

    const result = await store.dispatch(logoutUser());

    expect(result.type).toBe(logoutUser.rejected.type);
    expect(result.payload).toBe('Ошибка выхода');
  });
});
