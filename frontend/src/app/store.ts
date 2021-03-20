import { configureStore, Action } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';
import { combineReducers } from '@reduxjs/toolkit';
// Reducers
import searchProductReducer from '../features/searchProducts/searchProductsSlice';
import categoriesReducer from '../features/categories/categoriesSlice';

// Define rootReducer using combineReducers. Place all reducers inside as name: reducerName
const rootReducer = combineReducers({
  searchProducts: searchProductReducer,
  categories: categoriesReducer,
});

// Setting up store, pass in rootReducer and default middleware. Any custom middleware will go into concat()
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),
});

// Types
export type RootState = ReturnType<typeof rootReducer>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
