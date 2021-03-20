import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface Navbar {
  showSearch: boolean;
  showCategories: boolean;
}
const initialState: Navbar = {
  showSearch: false,
  showCategories: false,
};

// Slice
const navbarSlice = createSlice({
  name: `navbar`,
  initialState,
  reducers: {
    SET_SEARCH_TRUE(state) {
      state.showSearch = true;
    },
    SET_SEARCH_FALSE(state) {
      state.showSearch = false;
    },
    SET_CATEGORIES_TRUE(state) {
      state.showCategories = true;
    },
    SET_CATEGORIES_FALSE(state) {
      state.showCategories = false;
    },
  },
});

// Selectors
export const navbarSelector = (state: RootState) => state.navbar;
// Actions and reducer
export const {
  SET_SEARCH_TRUE,
  SET_SEARCH_FALSE,
  SET_CATEGORIES_TRUE,
  SET_CATEGORIES_FALSE,
} = navbarSlice.actions;
export default navbarSlice.reducer;
