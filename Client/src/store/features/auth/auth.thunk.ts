import { createAsyncThunk } from '@reduxjs/toolkit';
import type { LoginFormData } from '../../../validations/loginValidator';
import { loginApi } from '../../../api/auth';
import { handleThunkError } from '../../../utils/handleThunkError';

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (data: LoginFormData, { rejectWithValue }) => {
    try {
      return await loginApi(data);
    } catch (error) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);
