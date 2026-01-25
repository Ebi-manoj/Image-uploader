import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { ErrorMessage } from './constant';

export function handleApiError(error: unknown, description?: boolean) {
  console.log(error);
  if (isAxiosError(error)) {
    const message =
      error.response?.data.message || ErrorMessage.SOMETHING_WENT_WRONG;
    toast.error(message, {
      description: description ? 'Please contact support for more' : '',
    });
    console.log('isAxios');
  } else {
    toast.error(ErrorMessage.SERVER_ERROR, {
      description: 'Please contact support for more',
    });
    console.log('not axios');
  }
}
