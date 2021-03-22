import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { AppThunk, RootState } from '../../app/store';
import { User } from '../../components/users/UserItem';
import { axiosErrorHandler } from '../../utils/axiosErrorHandler';

interface Users {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  users: { [key: string]: User };
  error: string | null;
}
const initialState: Users = {
  status: 'idle',
  users: {},
  error: null,
};

// Slice
const usersSlice = createSlice({
  name: `users`,
  initialState,
  reducers: {
    GET_USER(state) {
      state.status = 'loading';
    },
    GET_USER_SUCCESS(state, action: PayloadAction<any>) {
      state.status = 'succeeded';
      state.users[action.payload._id] = action.payload;
    },
    GET_USER_FAIL(state, action: PayloadAction<string>) {
      state.status = 'failed';
      const error = action.payload;
      state.error = error;
    },
  },
});
// Fetching single user from database
export const fetchUser = (_id: string): AppThunk => async (
  dispatch,
  getState
) => {
  const state = getState();
  const {
    users: { users },
  } = state;
  if (_id in users === false) {
    dispatch(GET_USER());
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URI}/api/v1/user/user/${_id}`,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
      const data: User = res.data;
      dispatch(GET_USER_SUCCESS(data));
    } catch (err) {
      const error: string = axiosErrorHandler(err);
      dispatch(GET_USER_FAIL(error));
    }
  }
};

// Selectors
export const statusSelector = (state: RootState) => state.users.status;
export const usersSelector = (state: RootState) => state.users.users;
export const errorSelector = (state: RootState) => state.users.error;
// Actions and reducer
export const { GET_USER, GET_USER_SUCCESS, GET_USER_FAIL } = usersSlice.actions;
export default usersSlice.reducer;
