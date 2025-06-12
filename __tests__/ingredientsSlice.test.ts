import reducer, {
  fetchIngredients
} from '../src/features/ingredients/ingredientsSlice';
import { configureStore } from '@reduxjs/toolkit';
import * as api from '../src/utils/burger-api';
import { TIngredient } from '../src/utils/types';

jest.mock('../src/utils/burger-api');

describe('ingredientsSlice', () => {
  const initialState = {
    buns: [],
    mains: [],
    sauces: [],
    isLoading: false,
    error: null
  };

  describe('редюсер ingredientsSlice', () => {
    test('должен вернуть начальное состояние при неизвестном действии', () => {
      expect(reducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(
        initialState
      );
    });

    test('должен устанавливать isLoading=true при fetchIngredients.pending', () => {
      const action = { type: fetchIngredients.pending.type };
      const state = reducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('должен сохранять ингредиенты по категориям при fetchIngredients.fulfilled', () => {
      const ingredients: TIngredient[] = [
        {
          _id: '1',
          name: 'Булка',
          type: 'bun',
          proteins: 10,
          fat: 5,
          carbohydrates: 20,
          calories: 200,
          price: 50,
          image: '',
          image_large: '',
          image_mobile: ''
        },
        {
          _id: '2',
          name: 'Мясо',
          type: 'main',
          proteins: 20,
          fat: 10,
          carbohydrates: 5,
          calories: 300,
          price: 100,
          image: '',
          image_large: '',
          image_mobile: ''
        },
        {
          _id: '3',
          name: 'Соус',
          type: 'sauce',
          proteins: 2,
          fat: 1,
          carbohydrates: 3,
          calories: 50,
          price: 20,
          image: '',
          image_large: '',
          image_mobile: ''
        }
      ];

      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: ingredients
      };
      const state = reducer(initialState, action);

      expect(state.buns).toEqual([ingredients[0]]);
      expect(state.mains).toEqual([ingredients[1]]);
      expect(state.sauces).toEqual([ingredients[2]]);
      expect(state.isLoading).toBe(false);
    });

    test('должен сохранять ошибку при fetchIngredients.rejected', () => {
      const action = {
        type: fetchIngredients.rejected.type,
        payload: 'Ошибка при загрузке'
      };
      const state = reducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка при загрузке');
    });
  });

  describe('асинхронное действие fetchIngredients', () => {
    const mockIngredients: TIngredient[] = [
      {
        _id: '1',
        name: 'Булка',
        type: 'bun',
        proteins: 10,
        fat: 5,
        carbohydrates: 20,
        calories: 200,
        price: 50,
        image: '',
        image_large: '',
        image_mobile: ''
      },
      {
        _id: '2',
        name: 'Мясо',
        type: 'main',
        proteins: 20,
        fat: 10,
        carbohydrates: 5,
        calories: 300,
        price: 100,
        image: '',
        image_large: '',
        image_mobile: ''
      }
    ];

    const createTestStore = () =>
      configureStore({
        reducer: { ingredients: reducer }
      });

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('должен успешно загрузить ингредиенты', async () => {
      (api.getIngredientsApi as jest.Mock).mockResolvedValue(mockIngredients);

      const store = createTestStore();
      await store.dispatch(fetchIngredients());

      const state = store.getState().ingredients;
      expect(state.buns.length).toBe(1);
      expect(state.mains.length).toBe(1);
      expect(state.sauces.length).toBe(0);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    test('должен обработать ошибку загрузки', async () => {
      (api.getIngredientsApi as jest.Mock).mockRejectedValue(
        new Error('Сервер недоступен')
      );

      const store = createTestStore();
      await store.dispatch(fetchIngredients());

      const state = store.getState().ingredients;
      expect(state.buns).toEqual([]);
      expect(state.mains).toEqual([]);
      expect(state.sauces).toEqual([]);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Сервер недоступен');
    });
  });
});
