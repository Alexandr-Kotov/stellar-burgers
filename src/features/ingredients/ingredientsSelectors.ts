import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/services/store';

const selectBuns = (state: RootState) => state.ingredients.buns;
const selectMains = (state: RootState) => state.ingredients.mains;
const selectSauces = (state: RootState) => state.ingredients.sauces;

export const selectAllIngredients = createSelector(
  [selectBuns, selectMains, selectSauces],
  (buns, mains, sauces) => [...buns, ...mains, ...sauces]
);
