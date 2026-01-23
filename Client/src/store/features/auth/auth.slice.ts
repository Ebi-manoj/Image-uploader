import { createSlice } from '@reduxjs/toolkit';
import type { AuthState } from './auth';
import { loginThunk } from './auth.thunk';

const initialState: AuthState = {
  loading: false,
  token: null,
  user: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loginThunk.pending, state => {
        ((state.loading = true), (state.user = null));
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        const { accessToken, ...user } = action.payload;
        state.token = accessToken;
        state.user = user;
      })
      .addCase(loginThunk.rejected, state => {
        state.loading = false;
        state.user = null;
      });
  },
});

export default authSlice.reducer;
