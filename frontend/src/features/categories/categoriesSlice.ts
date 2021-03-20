import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../../app/store';
import axios from 'axios';

export interface Category {
  name: string;
  _id: string;
  description: string;
  parent: string;
  slug: string;
}

interface Categories {
  roots: Category[];
  rootId: string;
  depthOne: Category[];
  pathToRoot: Category[];
  error: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}
const initialState: Categories = {
  roots: [],
  rootId: '',
  depthOne: [],
  pathToRoot: [],
  error: null,
  status: 'idle',
};

// Slice
const categoriesSlice = createSlice({
  name: `categories`,
  initialState,
  reducers: {
    GET_ROOTS(state) {
      state.status = 'loading';
    },
    GET_ROOTS_SUCCESS(state, action: PayloadAction<Category[]>) {
      state.status = 'succeeded';
      state.roots = action.payload;
    },
    GET_ROOTS_FAIL(state, action: PayloadAction<string>) {
      state.status = 'failed';
      const error = action.payload;
      state.error = error;
    },
    SET_ROOT_ID(state, action: any) {
      state.rootId = action.payload;
    },
    GET_DEPTH_ONE(state) {
      state.status = 'loading';
    },
    GET_DEPTH_ONE_SUCCESS(state, action: PayloadAction<Category[]>) {
      state.status = 'succeeded';
      // Payload is array of objects
      action.payload.forEach((category: Category) => {
        state.depthOne.push(category);
      });
    },
    GET_DEPTH_ONE_FAIL(state, action: PayloadAction<string>) {
      state.status = 'failed';
      const error = action.payload;
      state.error = error;
    },
    GET_PATH_TO_ROOT(state) {
      state.status = 'loading';
    },
    GET_PATH_TO_ROOT_SUCCESS(state, action: any) {
      state.status = 'succeeded';
      state.pathToRoot = action.payload;
    },
    GET_PATH_TO_ROOT_FAIL(state, action: any) {
      state.status = 'failed';
      const error = action.payload;
      state.error = error;
    },
  },
});

// Selectors
export const categoriesSelector = (state: RootState) => state.categories;
// Actions and reducer
export const {
  GET_ROOTS,
  GET_ROOTS_SUCCESS,
  GET_ROOTS_FAIL,
  SET_ROOT_ID,
  GET_DEPTH_ONE,
  GET_DEPTH_ONE_SUCCESS,
  GET_DEPTH_ONE_FAIL,
  GET_PATH_TO_ROOT,
  GET_PATH_TO_ROOT_SUCCESS,
  GET_PATH_TO_ROOT_FAIL,
} = categoriesSlice.actions;
export default categoriesSlice.reducer;

// Fetch all root categories
export const fetchRoots = (): AppThunk => async (dispatch) => {
  dispatch(GET_ROOTS()); // this has to be before axios request. NOTE to myself: remember to actually pass GET_ROOTS as a function (so with ())...I spent 30 min trying to figure out why this was never dispatched
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URI}/api/v1/categories/roots`,
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
    const data: Category[] = res.data;

    dispatch(GET_ROOTS_SUCCESS(data));
  } catch (err) {
    let error: string;
    if (err.message === 'Network Error') error = err.message;
    else error = err.response.data;
    dispatch(GET_ROOTS_FAIL(error));
  }
};
// Fetch depth one categories
export const fetchDepthOne = (_id: string): AppThunk => async (dispatch) => {
  dispatch(GET_DEPTH_ONE());
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URI}/api/v1/categories/category/children/${_id}`,
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
    const data: Category[] = res.data;

    dispatch(GET_DEPTH_ONE_SUCCESS(data));
  } catch (err) {
    let error: string;
    if (err.message === 'Network Error') error = err.message;
    else error = err.response.data;
    dispatch(GET_DEPTH_ONE_FAIL(error));
  }
};
// Fetch category path to root
export const fetchPathToRoot = (slug: string): AppThunk => async (dispatch) => {
  dispatch(GET_PATH_TO_ROOT());
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URI}/api/v1/categories/category/root?category=${slug}`,
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );

    const data: Category[] = res.data;

    dispatch(GET_PATH_TO_ROOT_SUCCESS(data));
  } catch (err) {
    let error: string;
    if (err.message === 'Network Error') error = err.message;
    else error = err.response.data;
    dispatch(GET_PATH_TO_ROOT_FAIL(error));
  }
};
