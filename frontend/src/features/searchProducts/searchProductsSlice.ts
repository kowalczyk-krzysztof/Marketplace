import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { AppThunk } from '../../app/store';
import { RootState } from '../../app/store';

import { ProductSummary } from '../../components/products/DisplayProductsSummary';

/**
 * Setting up a slice:
 * 1. createSlice and pass in name, initialState and reducers
 * 2. Create interface for initialState
 * 3. Export actions
 * 4. Exprot reducers
 */

interface SearchProducts {
  isLoading: boolean;
  searchProducts: ProductSummary[];
  error: string | null;
}

const initialState: SearchProducts = {
  isLoading: false,
  searchProducts: [],
  error: null,
};

// Slice
const searchProductsSlice = createSlice({
  name: 'searchProducts',
  initialState,
  reducers: {
    GET_SEARCH_PRODUCTS(state) {
      state.isLoading = true;
    },
    GET_SEARCH_PRODUCTS_SUCCESS(
      state,
      action: PayloadAction<ProductSummary[]>
    ) {
      state.isLoading = false;

      state.searchProducts = action.payload;
      state.error = null;
    },
    GET_SEARCH_PRODUCTS_FAIL(state, action: PayloadAction<string>) {
      state.isLoading = false;
      const error = action.payload;
      state.error = error;
    },
  },
});

// Fetching products from database
export const fetchProducts = (text: string): AppThunk => async (dispatch) => {
  dispatch(GET_SEARCH_PRODUCTS);
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URI}/api/v1/products/find/search?term=${text}`,
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
    const data: ProductSummary[] = res.data;

    dispatch(GET_SEARCH_PRODUCTS_SUCCESS(data));
  } catch (err) {
    const error: string = err.response.data;
    dispatch(GET_SEARCH_PRODUCTS_FAIL(error));
  }
};
// Selectors
export const searchProductsSelector = (state: RootState) =>
  state.searchProducts;
// Actions and reducer
export const {
  GET_SEARCH_PRODUCTS_SUCCESS,
  GET_SEARCH_PRODUCTS_FAIL,
  GET_SEARCH_PRODUCTS,
} = searchProductsSlice.actions;
export default searchProductsSlice.reducer;
