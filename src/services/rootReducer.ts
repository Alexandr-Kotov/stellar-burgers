import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from '../features/ingredients/ingredientsSlice';
import constructorReducer from '../features/constructor/constructorSlice';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  constructorBurger: constructorReducer
});

export default rootReducer;
