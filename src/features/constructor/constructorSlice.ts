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
    // Примеры экшенов:
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.items.ingredients.push(action.payload);
    },
    setBun: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.items.bun = action.payload;
    },
    resetConstructor: (state) => {
      state.items = { bun: null, ingredients: [] };
    }
  }
});

export const { addIngredient, setBun, resetConstructor } =
  constructorSlice.actions;
export default constructorSlice.reducer;
