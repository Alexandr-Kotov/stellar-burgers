import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from '../features/ingredients/ingredientsSlice';
import constructorReducer from '../features/constructor/constructorSlice';
import feedReducer from '../features/feedSlice/feedSlice';
import authReducer from '../features/authSlice/authSlice';
import profileReducer from '../features/profileSlice/profileSlice';
import orderReducer from '../features/orderSlice/orderSlice';
import userOrdersSlice from '../features/userOrdersSlice/userOrdersSlice';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  constructorBurger: constructorReducer,
  feed: feedReducer,
  auth: authReducer,
  profile: profileReducer,
  order: orderReducer,
  userOrders: userOrdersSlice
});

export default rootReducer;
