import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../../app/store';
import axios from 'axios';
// Components and interfaces
import { ProductSummary } from '../../components/products/DisplayProductsSummary';

/**
 * Setting up a slice:
 * 1. createSlice and pass in name, initialState and reducers
 * 2. Create interface for initialState
 * 3. Export actions
 * 4. Exprot reducers
 */

interface SearchProducts {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  searchProducts: ProductSummary[];
  error: string | null;
}

const initialState: SearchProducts = {
  status: 'idle',
  searchProducts: [],
  error: null,
};

// Slice
const searchProductsSlice = createSlice({
  name: 'searchProducts',
  initialState,
  reducers: {
    GET_SEARCH_PRODUCTS(state) {
      state.status = 'loading';
    },
    GET_SEARCH_PRODUCTS_SUCCESS(
      state,
      action: PayloadAction<ProductSummary[]>
    ) {
      state.status = 'succeeded';
      state.searchProducts = action.payload;
      state.error = null;
    },
    GET_SEARCH_PRODUCTS_FAIL(state, action: PayloadAction<string>) {
      state.status = 'failed';
      const error = action.payload;
      state.error = error;
    },
  },
});

// Fetching products from database
export const fetchProducts = (text: string): AppThunk => async (dispatch) => {
  dispatch(GET_SEARCH_PRODUCTS());
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
    let error: string;
    if (err.message === 'Network Error') error = err.message;
    else error = err.response.data;
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
