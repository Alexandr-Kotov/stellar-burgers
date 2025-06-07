import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '@utils-types';

interface ConstructorState {
  items: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  orderModalData: any; // замените на точный тип, если есть
}

const initialState: ConstructorState = {
  items: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null
};

const constructorSlice = createSlice({
  name: 'constructorBurger',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.items.ingredients.push(action.payload);
    },
    setBun: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.items.bun = action.payload;
    },
    resetConstructor: (state) => {
      state.items = { bun: null, ingredients: [] };
    },
    moveIngredientUp: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index > 0) {
        const items = state.items.ingredients;
        [items[index - 1], items[index]] = [items[index], items[index - 1]];
      }
    },
    moveIngredientDown: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      const items = state.items.ingredients;
      if (index < items.length - 1) {
        [items[index], items[index + 1]] = [items[index + 1], items[index]];
      }
    },
    removeIngredient: (state, action: PayloadAction<number>) => {
      state.items.ingredients.splice(action.payload, 1);
    }
  }
});

export const {
  addIngredient,
  setBun,
  resetConstructor,
  moveIngredientDown,
  moveIngredientUp,
  removeIngredient
} = constructorSlice.actions;
export default constructorSlice.reducer;
