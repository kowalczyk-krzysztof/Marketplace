import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../../app/store';
import axios from 'axios';
import { axiosErrorHandler } from '../../utils/axiosErrorHandler';
export interface Category {
  name: string;
  _id: string;
  description: string;
  parent: string;
  slug: string;
}
interface CategoryWithChildren extends Category {
  children: Category[];
}

interface CategoryWithPath extends Category {
  path: Category[];
}

interface Categories {
  roots: { [key: string]: CategoryWithChildren };
  showRootChildren: { [key: string]: boolean };
  pathToRoot: { [key: string]: CategoryWithPath };
  error: string | null;
  rootStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  pathStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}
const initialState: Categories = {
  roots: {},
  showRootChildren: {},
  pathToRoot: {},
  error: null,
  rootStatus: 'idle',
  pathStatus: 'idle',
};

// Slice
const categoriesSlice = createSlice({
  name: `categories`,
  initialState,
  reducers: {
    GET_ROOTS(state) {
      state.rootStatus = 'loading';
    },
    GET_ROOTS_SUCCESS(state, action: PayloadAction<CategoryWithChildren[]>) {
      state.rootStatus = 'succeeded';
      // Here I take an array of CategoryWithChildren and for each CategoryWithChildren I make a key in roots object with key name category._id and assign corresponding category as a value
      action.payload.forEach((category: CategoryWithChildren) => {
        state.roots[category._id] = category;
      });
    },
    GET_ROOTS_FAIL(state, action: PayloadAction<string>) {
      state.rootStatus = 'failed';
      const error = action.payload;
      state.error = error;
    },
    SET_SHOW_ROOT_CHILDREN(state, action: PayloadAction<string>) {
      state.showRootChildren[action.payload] = true;
      /* This is equal to:
       *  state.showRootChildren = {
        ...state.showRootChildren,
        [action.payload]: true,
      };
       */
    },
    SHOW_ROOT_CHILDREN_TRUE(state, action: PayloadAction<string>) {
      state.showRootChildren[action.payload] = true;
    },
    SHOW_ROOT_CHILDREN_FALSE(state, action: PayloadAction<string>) {
      state.showRootChildren[action.payload] = false;
    },

    GET_PATH_TO_ROOT(state) {
      state.pathStatus = 'loading';
    },
    GET_PATH_TO_ROOT_SUCCESS(state, action: PayloadAction<CategoryWithPath>) {
      state.pathToRoot[action.payload._id] = action.payload;
      state.pathStatus = 'succeeded';
    },
    GET_PATH_TO_ROOT_FAIL(state, action: PayloadAction<string>) {
      state.pathStatus = 'failed';
      const error = action.payload;
      state.error = error;
    },
  },
});

// Selectors - listening to whole store is a bad idea
export const rootsSelector = (state: RootState) => state.categories.roots;
export const showRootChildrenSelector = (state: RootState) =>
  state.categories.showRootChildren;
export const pathToRootSelector = (state: RootState) =>
  state.categories.pathToRoot;
export const errorSelector = (state: RootState) => state.categories.error;
export const rootStatusSelector = (state: RootState) =>
  state.categories.rootStatus;
export const pathStatusSelector = (state: RootState) =>
  state.categories.pathStatus;
// Actions and reducer
export const {
  GET_ROOTS,
  GET_ROOTS_SUCCESS,
  GET_ROOTS_FAIL,
  SET_SHOW_ROOT_CHILDREN,
  SHOW_ROOT_CHILDREN_TRUE,
  SHOW_ROOT_CHILDREN_FALSE,
  GET_PATH_TO_ROOT,
  GET_PATH_TO_ROOT_SUCCESS,
  GET_PATH_TO_ROOT_FAIL,
} = categoriesSlice.actions;
export default categoriesSlice.reducer;

// Fetch all root categories
export const fetchRoots = (): AppThunk => async (dispatch, getState) => {
  const state = getState();
  const {
    categories: { roots },
  } = state;
  // Otherwise it would keep refetching
  if (Object.entries(roots).length === 0) {
    dispatch(GET_ROOTS());

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URI}/api/v1/categories/roots`,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
      const data: CategoryWithChildren[] = res.data;

      dispatch(GET_ROOTS_SUCCESS(data));
    } catch (err) {
      const error: string = axiosErrorHandler(err);
      dispatch(GET_ROOTS_FAIL(error));
    }
  }
};
// Fetch category path to root
export const fetchPathToRoot = (slug: string, _id: string): AppThunk => async (
  dispatch,
  getState
) => {
  const state = getState();
  const {
    categories: { pathToRoot },
  } = state;
  console.log(_id);

  if (_id in pathToRoot === false) {
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

      const data: CategoryWithPath = res.data;

      dispatch(GET_PATH_TO_ROOT_SUCCESS(data));
    } catch (err) {
      const error: string = axiosErrorHandler(err);
      dispatch(GET_PATH_TO_ROOT_FAIL(error));
    }
  }
};
