import { isAxiosError } from 'axios';
import { ErrorMessage } from './constant';

export function handleThunkError<T>(
  error: unknown,
  rejectWithValue: (value: T) => T,
  defaultMsge: string = ErrorMessage.SOMETHING_WENT_WRONG,
) {
  console.log('error object', error);
  if (isAxiosError(error)) {
    return rejectWithValue(error.response?.data?.message || defaultMsge);
  }
  return rejectWithValue(ErrorMessage.SERVER_ERROR as T);
}
