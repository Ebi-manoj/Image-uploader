import axios from 'axios';
import type { AppDispatch, RootState } from '../store/store';
import { refreshTokenApi } from '../api/auth';
import { clearUser, setUser } from '../store/features/auth/auth.slice';

export const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api`,
  withCredentials: true,
});


export const setupAxiosInterceptors = (
  store: { getState: () => RootState; dispatch: AppDispatch },
) => {
 
  axiosInstance.interceptors.request.use(
    config => {
      const state = store.getState();
      const token = state.auth.token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    error => Promise.reject(error),
  );

 
  axiosInstance.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;

     
      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url?.includes('/refresh-token')
      ) {
        originalRequest._retry = true;

        try {
          
          const res = await refreshTokenApi();
          const newToken = res.accessToken;

      
          store.dispatch(setUser(res));

        
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
         
          store.dispatch(clearUser());
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    },
  );
};
