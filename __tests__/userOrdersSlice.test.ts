import reducer, {
  fetchUserOrders,
  fetchUserOrderByNumber
} from '../src/features/userOrdersSlice/userOrdersSlice';

import { configureStore } from '@reduxjs/toolkit';
import * as api from '../src/utils/burger-api';

jest.mock('../src/utils/burger-api');

describe('userOrdersSlice', () => {
  describe('редюсер userOrdersSlice', () => {
    const initialState = {
      orders: [],
      currentOrder: null,
      loading: false,
      error: null
    };

    test('должен возвращать начальное состояние при неизвестном действии', () => {
      expect(reducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(
        initialState
      );
    });

    test('должен устанавливать loading в true при fetchUserOrders.pending', () => {
      const action = { type: fetchUserOrders.pending.type };
      const state = reducer(initialState, action);
      expect(state.loading).toBe(true);
    });

    test('должен сохранять список заказов при fetchUserOrders.fulfilled', () => {
      const mockOrders = [{ _id: '1', number: 123 }];
      const action = {
        type: fetchUserOrders.fulfilled.type,
        payload: mockOrders
      };
      const state = reducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.orders).toEqual(mockOrders);
    });

    test('должен сохранять ошибку при fetchUserOrders.rejected', () => {
      const action = {
        type: fetchUserOrders.rejected.type,
        error: { message: 'Не удалось загрузить заказы' }
      };
      const state = reducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Не удалось загрузить заказы');
    });

    test('должен устанавливать loading и сбрасывать текущий заказ при fetchUserOrderByNumber.pending', () => {
      const action = { type: fetchUserOrderByNumber.pending.type };
      const state = reducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.currentOrder).toBeNull();
    });

    test('должен сохранять заказ при fetchUserOrderByNumber.fulfilled', () => {
      const order = { _id: '1', number: 555 };
      const action = {
        type: fetchUserOrderByNumber.fulfilled.type,
        payload: order
      };
      const state = reducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.currentOrder).toEqual(order);
    });

    test('должен сохранять ошибку при fetchUserOrderByNumber.rejected', () => {
      const action = {
        type: fetchUserOrderByNumber.rejected.type,
        error: { message: 'Не удалось загрузить заказ' }
      };
      const state = reducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Не удалось загрузить заказ');
    });
  });

  describe('асинхронные действия', () => {
    const mockOrders = [
      {
        _id: '1',
        number: 101,
        ingredients: [],
        status: 'done',
        name: 'Тестовый бургер',
        createdAt: '',
        updatedAt: ''
      }
    ];

    const createTestStore = () =>
      configureStore({
        reducer: { userOrders: reducer }
      });

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('fetchUserOrders — должен успешно загрузить заказы', async () => {
      (api.getOrdersApi as jest.Mock).mockResolvedValue(mockOrders);

      const store = createTestStore();
      await store.dispatch(fetchUserOrders());

      const state = store.getState().userOrders;
      expect(state.orders).toEqual(mockOrders);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    test('fetchUserOrders — должен обработать ошибку при загрузке заказов', async () => {
      (api.getOrdersApi as jest.Mock).mockRejectedValue(
        new Error('Не удалось загрузить заказы')
      );

      const store = createTestStore();
      await store.dispatch(fetchUserOrders());

      const state = store.getState().userOrders;
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Не удалось загрузить заказы');
    });

    test('fetchUserOrderByNumber — должен вернуть один заказ при успехе', async () => {
      (api.getOrderByNumberApi as jest.Mock).mockResolvedValue({
        orders: [mockOrders[0]]
      });

      const store = createTestStore();
      await store.dispatch(fetchUserOrderByNumber(101));

      const state = store.getState().userOrders;
      expect(state.currentOrder).toEqual(mockOrders[0]);
      expect(state.loading).toBe(false);
    });

    test('fetchUserOrderByNumber — должен обработать ошибку при неудаче', async () => {
      (api.getOrderByNumberApi as jest.Mock).mockRejectedValue(
        new Error('Заказ не найден')
      );

      const store = createTestStore();
      await store.dispatch(fetchUserOrderByNumber(999));

      const state = store.getState().userOrders;
      expect(state.error).toBe('Заказ не найден');
      expect(state.currentOrder).toBeNull();
    });
  });
});
