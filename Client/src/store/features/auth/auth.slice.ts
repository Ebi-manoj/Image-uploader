import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState } from './auth';
import { loginThunk } from './auth.thunk';
import type { LoginResDTO } from '../../../types/auth';

const initialState: AuthState = {
  loading: false,
  token: null,
  user: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<LoginResDTO>) => {
      const { accessToken, ...user } = action.payload;
      state.token = accessToken;
      state.user = user;
    },
    clearUser: state => {
      state.token = null;
      state.user = null;
    },
  },
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

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
