import { configureStore, Action } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';
import { combineReducers, getDefaultMiddleware } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// Reducers
import searchProductReducer from '../features/products/productsSlice';
import categoriesReducer from '../features/categories/categoriesSlice';
import navbarReducer from '../features/navbar/navbarSlice';
import usersReducer from '../features/users/usersSlice';

// Define rootReducer using combineReducers. Place all reducers inside as name: reducerName
const rootReducer = combineReducers({
  products: searchProductReducer,
  categories: categoriesReducer,
  users: usersReducer,
  navbar: navbarReducer,
});

/*
 * redux-persist is a tool that allow persisting the redux store between page refreshes etc. To make it work, define persistConfig and persistedReducer and pass persistConfig and rootReducer to persistedReducer then use it as default reducer. To stop getting serialization errors, you need to ignore persist action in middleware
 * 
 * middleware: getDefaultMiddleware({
    serializableCheck: { ignoredActions: ['persist/PERSIST'] },

 * After setting up store, you need to wrap your <App> (or only the components you want) component with <PersistGate loading={null} persistor={persistor}> which itself is wrapped by <Provider>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          // App components here
        </BrowserRouter>
      </PersistGate>
    </Provider>
    
 */

// Redux persist config
const persistConfig = {
  key: 'root',
  storage,
};
// Redux persist reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Setting up store, pass in rootReducer and default middleware.
export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: getDefaultMiddleware({
    serializableCheck: { ignoredActions: ['persist/PERSIST'] },
  }),
});

// Types
export type RootState = ReturnType<typeof rootReducer>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
