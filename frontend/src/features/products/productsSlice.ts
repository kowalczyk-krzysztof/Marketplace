import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../../app/store';
import axios from 'axios';
// Components and interfaces
import { axiosErrorHandler } from '../../utils/axiosErrorHandler';
import { ProductFull } from '../../components/products/ProductItemFull';

/**
 * Setting up a slice:
 * 1. createSlice and pass in name, initialState and reducers
 * 2. Create interface for initialState
 * 3. Export actions
 * 4. Exprot reducers
 */

interface Products {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  products: { [key: string]: ProductFull };
  error: string | null;
}

const initialState: Products = {
  status: 'idle',
  products: {},
  error: null,
};

// Slice
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    GET_SEARCH_PRODUCTS(state) {
      state.status = 'loading';
    },
    GET_SEARCH_PRODUCTS_SUCCESS(state, action: PayloadAction<ProductFull[]>) {
      state.status = 'succeeded';
      action.payload.forEach((product: ProductFull) => {
        state.products[product._id] = product;
      });
    },
    GET_SEARCH_PRODUCTS_FAIL(state, action: PayloadAction<string>) {
      state.status = 'failed';
      const error = action.payload;
      state.error = error;
    },
    GET_PRODUCT(state) {
      state.status = 'loading';
    },
    GET_PRODUCT_SUCCESS(state, action: PayloadAction<ProductFull>) {
      state.status = 'succeeded';
      state.products[action.payload._id] = action.payload;
    },
    GET_PRODUCT_FAIL(state, action: PayloadAction<string>) {
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
    const data: ProductFull[] = res.data;

    dispatch(GET_SEARCH_PRODUCTS_SUCCESS(data));
  } catch (err) {
    const error: string = axiosErrorHandler(err);
    dispatch(GET_SEARCH_PRODUCTS_FAIL(error));
  }
};

// Fetching single product from database
export const fetchProduct = (_id: string): AppThunk => async (
  dispatch,
  getState
) => {
  const state = getState();
  const {
    products: { products },
  } = state;
  if (_id in products === false) {
    dispatch(GET_PRODUCT());
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URI}/api/v1/products/find/product/${_id}`,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
      const data: ProductFull = res.data;
      dispatch(GET_PRODUCT_SUCCESS(data));
    } catch (err) {
      const error: string = axiosErrorHandler(err);
      dispatch(GET_PRODUCT_FAIL(error));
    }
  }
};

// Selectors
export const statusSelector = (state: RootState) => state.products.status;
export const productsSelector = (state: RootState) => state.products.products;
export const errorSelector = (state: RootState) => state.products.error;
// Actions and reducer
export const {
  GET_SEARCH_PRODUCTS_SUCCESS,
  GET_SEARCH_PRODUCTS_FAIL,
  GET_SEARCH_PRODUCTS,
  GET_PRODUCT,
  GET_PRODUCT_SUCCESS,
  GET_PRODUCT_FAIL,
} = productsSlice.actions;
export default productsSlice.reducer;
