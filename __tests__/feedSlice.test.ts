import reducer, { fetchFeeds } from '../src/features/feedSlice/feedSlice';
import { configureStore } from '@reduxjs/toolkit';
import * as api from '../src/utils/burger-api';

jest.mock('../src/utils/burger-api');

describe('feedSlice', () => {
  const initialState = {
    orders: [],
    total: 0,
    totalToday: 0,
    isLoading: false,
    error: null
  };

  describe('редюсер feedSlice', () => {
    test('должен возвращать начальное состояние при неизвестном действии', () => {
      expect(reducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(
        initialState
      );
    });

    test('должен устанавливать isLoading: true при fetchFeeds.pending', () => {
      const action = { type: fetchFeeds.pending.type };
      const state = reducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('должен сохранять данные фида при fetchFeeds.fulfilled', () => {
      const mockPayload = {
        orders: [
          {
            _id: '1',
            status: 'done',
            name: 'Бургер',
            createdAt: '',
            updatedAt: '',
            number: 123,
            ingredients: []
          }
        ],
        total: 1000,
        totalToday: 100
      };
      const action = { type: fetchFeeds.fulfilled.type, payload: mockPayload };
      const state = reducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.orders).toEqual(mockPayload.orders);
      expect(state.total).toBe(1000);
      expect(state.totalToday).toBe(100);
    });

    test('должен сохранять ошибку при fetchFeeds.rejected', () => {
      const action = {
        type: fetchFeeds.rejected.type,
        payload: 'Ошибка загрузки'
      };
      const state = reducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка загрузки');
    });
  });

  describe('асинхронное действие fetchFeeds', () => {
    const mockOrders = [
      {
        _id: 'a1',
        status: 'created',
        name: 'TestOrder',
        createdAt: '',
        updatedAt: '',
        number: 456,
        ingredients: []
      }
    ];

    const createTestStore = () =>
      configureStore({
        reducer: { feed: reducer }
      });

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('fetchFeeds — успешно загружает заказы', async () => {
      (api.getFeedsApi as jest.Mock).mockResolvedValue({
        orders: mockOrders,
        total: 999,
        totalToday: 55
      });

      const store = createTestStore();
      await store.dispatch(fetchFeeds());

      const state = store.getState().feed;
      expect(state.orders).toEqual(mockOrders);
      expect(state.total).toBe(999);
      expect(state.totalToday).toBe(55);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    test('fetchFeeds — обрабатывает ошибку', async () => {
      (api.getFeedsApi as jest.Mock).mockRejectedValue(
        new Error('Ошибка сервера')
      );

      const store = createTestStore();
      await store.dispatch(fetchFeeds());

      const state = store.getState().feed;
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка сервера');
      expect(state.orders).toEqual([]);
    });
  });
});
