import reducer, {
  fetchUser,
  updateUser,
  clearProfile,
  ProfileState
} from '../src/features/profileSlice/profileSlice';

import { configureStore } from '@reduxjs/toolkit';
import * as api from '../src/utils/burger-api';

jest.mock('../src/utils/burger-api');

describe('profileSlice', () => {
  describe('редюсер profileSlice', () => {
    const initialState: ProfileState = {
      user: null,
      status: 'idle',
      error: null
    };

    test('должен возвращать начальное состояние при неизвестном действии', () => {
      expect(reducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(
        initialState
      );
    });

    test('должен устанавливать статус "loading" при fetchUser.pending', () => {
      const action = { type: fetchUser.pending.type };
      const state = reducer(initialState, action);
      expect(state.status).toBe('loading');
      expect(state.error).toBeNull();
    });

    test('должен сохранять пользователя при fetchUser.fulfilled', () => {
      const user = { name: 'Test', email: 'test@test.com' };
      const action = { type: fetchUser.fulfilled.type, payload: user };
      const state = reducer(initialState, action);
      expect(state.status).toBe('succeeded');
      expect(state.user).toEqual(user);
    });

    test('должен сохранять ошибку при fetchUser.rejected', () => {
      const action = {
        type: fetchUser.rejected.type,
        payload: 'Ошибка загрузки'
      };
      const state = reducer(initialState, action);
      expect(state.status).toBe('failed');
      expect(state.error).toBe('Ошибка загрузки');
    });

    test('должен устанавливать статус "loading" при updateUser.pending', () => {
      const action = { type: updateUser.pending.type };
      const state = reducer(initialState, action);
      expect(state.status).toBe('loading');
      expect(state.error).toBeNull();
    });

    test('должен обновлять пользователя при updateUser.fulfilled', () => {
      const updatedUser = { name: 'Updated', email: 'upd@test.com' };
      const action = {
        type: updateUser.fulfilled.type,
        payload: updatedUser
      };
      const state = reducer(initialState, action);
      expect(state.status).toBe('succeeded');
      expect(state.user).toEqual(updatedUser);
    });

    test('должен сохранять ошибку при updateUser.rejected', () => {
      const action = {
        type: updateUser.rejected.type,
        payload: 'Ошибка обновления'
      };
      const state = reducer(initialState, action);
      expect(state.status).toBe('failed');
      expect(state.error).toBe('Ошибка обновления');
    });

    test('должен очищать профиль при clearProfile', () => {
      const modifiedState: ProfileState = {
        user: { name: 'Test', email: 'test@test.com' },
        status: 'succeeded',
        error: null
      };
      const action = clearProfile();
      const state = reducer(modifiedState, action);
      expect(state).toEqual(initialState);
    });
  });

  describe('асинхронные действия', () => {
    const mockUser = { name: 'Test User', email: 'test@user.com' };

    const createTestStore = () =>
      configureStore({
        reducer: { profile: reducer }
      });

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('fetchUser — должен успешно загрузить пользователя', async () => {
      (api.getUserApi as jest.Mock).mockResolvedValue({ user: mockUser });

      const store = createTestStore();
      await store.dispatch(fetchUser());

      const state = store.getState().profile;
      expect(state.user).toEqual(mockUser);
      expect(state.status).toBe('succeeded');
      expect(state.error).toBeNull();
    });

    test('fetchUser — должен обработать ошибку', async () => {
      (api.getUserApi as jest.Mock).mockRejectedValue(
        new Error('Ошибка получения пользователя')
      );

      const store = createTestStore();
      await store.dispatch(fetchUser());

      const state = store.getState().profile;
      expect(state.status).toBe('failed');
      expect(state.error).toBe('Ошибка получения пользователя');
    });

    test('updateUser — должен обновить данные пользователя', async () => {
      (api.updateUserApi as jest.Mock).mockResolvedValue({ user: mockUser });

      const store = createTestStore();
      await store.dispatch(updateUser({ name: 'Test' }));

      const state = store.getState().profile;
      expect(state.user).toEqual(mockUser);
      expect(state.status).toBe('succeeded');
    });

    test('updateUser — должен обработать ошибку обновления', async () => {
      (api.updateUserApi as jest.Mock).mockRejectedValue(
        new Error('Ошибка обновления')
      );

      const store = createTestStore();
      await store.dispatch(updateUser({ name: 'Fail' }));

      const state = store.getState().profile;
      expect(state.status).toBe('failed');
      expect(state.error).toBe('Ошибка обновления');
    });
  });
});
