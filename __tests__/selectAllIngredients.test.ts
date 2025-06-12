import { selectAllIngredients } from '../src/features/ingredients/ingredientsSelectors';
import { TIngredient } from '../src/utils/types';

describe('selectAllIngredients', () => {
  const bun: TIngredient = {
    _id: '1',
    name: 'Булка',
    type: 'bun',
    proteins: 1,
    fat: 1,
    carbohydrates: 1,
    calories: 100,
    price: 10,
    image: '',
    image_large: '',
    image_mobile: ''
  };
  const main: TIngredient = {
    _id: '2',
    name: 'Котлета',
    type: 'main',
    proteins: 2,
    fat: 2,
    carbohydrates: 2,
    calories: 200,
    price: 20,
    image: '',
    image_large: '',
    image_mobile: ''
  };
  const sauce: TIngredient = {
    _id: '3',
    name: 'Соус',
    type: 'sauce',
    proteins: 0,
    fat: 0,
    carbohydrates: 3,
    calories: 50,
    price: 5,
    image: '',
    image_large: '',
    image_mobile: ''
  };

  const mockState = {
    ingredients: {
      buns: [bun],
      mains: [main],
      sauces: [sauce],
      isLoading: false,
      error: null
    }
  };

  it('должен объединять все типы ингредиентов в один массив', () => {
    const result = selectAllIngredients(mockState as any);
    expect(result).toEqual([bun, main, sauce]);
  });
});
