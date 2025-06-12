import reducer, {
  addIngredient,
  setBun,
  resetConstructor,
  moveIngredientDown,
  moveIngredientUp,
  removeIngredient
} from '../src/features/constructor/constructorSlice';
import { TConstructorIngredient } from '../src/utils/types';

describe('constructorSlice', () => {
  const ingredient1: TConstructorIngredient = {
    _id: '1',
    id: 'unique-drag-id-1',
    name: 'Соус традиционный галактический',
    type: 'sauce',
    proteins: 0,
    fat: 0,
    carbohydrates: 0,
    calories: 100,
    price: 15,
    image: '',
    image_large: '',
    image_mobile: ''
  };

  const ingredient2: TConstructorIngredient = {
    ...ingredient1,
    _id: '2',
    name: 'Соус фирменный императорский'
  };

  const bun: TConstructorIngredient = {
    ...ingredient1,
    _id: '3',
    name: 'Краторная булка N-200i',
    type: 'bun'
  };

  const initialState = {
    items: {
      bun: null,
      ingredients: []
    },
    orderRequest: false,
    orderModalData: null
  };

  test('должен возвращать начальное состояние', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  test('должен добавить ингредиент', () => {
    const state = reducer(initialState, addIngredient(ingredient1));
    expect(state.items.ingredients).toHaveLength(1);
    expect(state.items.ingredients[0]).toEqual(ingredient1);
  });

  test('должен установить булку', () => {
    const state = reducer(initialState, setBun(bun));
    expect(state.items.bun).toEqual(bun);
  });

  test('должен сбрасывать конструктор', () => {
    const modifiedState = {
      ...initialState,
      items: { bun, ingredients: [ingredient1, ingredient2] }
    };
    const state = reducer(modifiedState, resetConstructor());
    expect(state.items.bun).toBeNull();
    expect(state.items.ingredients).toEqual([]);
  });

  test('должен перемещать ингредиент вверх', () => {
    const modState = {
      ...initialState,
      items: { bun: null, ingredients: [ingredient1, ingredient2] }
    };
    const state = reducer(modState, moveIngredientUp(1));
    expect(state.items.ingredients[0]).toEqual(ingredient2);
    expect(state.items.ingredients[1]).toEqual(ingredient1);
  });

  test('не должен перемещать вверх элемент с индексом 0', () => {
    const modState = {
      ...initialState,
      items: { bun: null, ingredients: [ingredient1, ingredient2] }
    };
    const state = reducer(modState, moveIngredientUp(0));
    expect(state.items.ingredients[0]).toEqual(ingredient1);
  });

  test('должен перемещать ингредиент вниз', () => {
    const modState = {
      ...initialState,
      items: { bun: null, ingredients: [ingredient1, ingredient2] }
    };
    const state = reducer(modState, moveIngredientDown(0));
    expect(state.items.ingredients[0]).toEqual(ingredient2);
    expect(state.items.ingredients[1]).toEqual(ingredient1);
  });

  test('не должен перемещать вниз последний элемент', () => {
    const modState = {
      ...initialState,
      items: { bun: null, ingredients: [ingredient1, ingredient2] }
    };
    const state = reducer(modState, moveIngredientDown(1));
    expect(state.items.ingredients[1]).toEqual(ingredient2);
  });

  test('должен удалять ингредиент по индексу', () => {
    const modState = {
      ...initialState,
      items: { bun: null, ingredients: [ingredient1, ingredient2] }
    };
    const state = reducer(modState, removeIngredient(0));
    expect(state.items.ingredients).toHaveLength(1);
    expect(state.items.ingredients[0]).toEqual(ingredient2);
  });
});
