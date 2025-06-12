import reducer, {
  placeOrder,
  closeOrderModal
} from '../src/features/orderSlice/orderSlice';
import { configureStore } from '@reduxjs/toolkit';
import * as api from '../src/utils/burger-api';
import { TOrder } from '../src/utils/types';

jest.mock('../src/utils/burger-api');

describe('orderSlice', () => {
  const initialState = {
    orderRequest: false,
    orderError: null,
    orderModalData: null
  };

  const order: TOrder = {
    _id: 'order123',
    status: 'done',
    name: 'Test Order',
    createdAt: '2025-06-11T00:00:00.000Z',
    updatedAt: '2025-06-11T00:10:00.000Z',
    number: 1234,
    ingredients: ['ingredient1', 'ingredient2']
  };

  describe('редюсер orderSlice', () => {
    test('должен возвращать начальное состояние при неизвестном действии', () => {
      expect(reducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(
        initialState
      );
    });

    test('должен устанавливать orderRequest: true при placeOrder.pending', () => {
      const action = { type: placeOrder.pending.type };
      const state = reducer(initialState, action);
      expect(state.orderRequest).toBe(true);
      expect(state.orderError).toBeNull();
    });

    test('должен сохранять данные заказа при placeOrder.fulfilled', () => {
      const action = { type: placeOrder.fulfilled.type, payload: order };
      const state = reducer(initialState, action);
      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toEqual(order);
    });

    test('должен сохранять ошибку при placeOrder.rejected', () => {
      const action = {
        type: placeOrder.rejected.type,
        payload: 'Ошибка заказа'
      };
      const state = reducer(initialState, action);
      expect(state.orderRequest).toBe(false);
      expect(state.orderError).toBe('Ошибка заказа');
    });

    test('должен очищать модальное окно при closeOrderModal', () => {
      const modifiedState = {
        orderRequest: false,
        orderError: 'Ошибка',
        orderModalData: order
      };
      const state = reducer(modifiedState, closeOrderModal());
      expect(state.orderModalData).toBeNull();
      expect(state.orderError).toBeNull();
    });
  });

  describe('асинхронное действие placeOrder', () => {
    const createTestStore = () =>
      configureStore({
        reducer: { order: reducer }
      });

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('успешное оформление заказа', async () => {
      (api.orderBurgerApi as jest.Mock).mockResolvedValue({ order });

      const store = createTestStore();
      await store.dispatch(placeOrder(['123', '456']));

      const state = store.getState().order;
      expect(state.orderModalData).toEqual(order);
      expect(state.orderRequest).toBe(false);
      expect(state.orderError).toBeNull();
    });

    test('обработка ошибки при оформлении заказа', async () => {
      (api.orderBurgerApi as jest.Mock).mockRejectedValue(
        new Error('Сервер недоступен')
      );

      const store = createTestStore();
      await store.dispatch(placeOrder(['789']));
      const state = store.getState().order;
      expect(state.orderModalData).toBeNull();
      expect(state.orderRequest).toBe(false);
      expect(state.orderError).toBe('Сервер недоступен');
    });
  });
});
