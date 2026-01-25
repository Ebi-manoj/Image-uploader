import type React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { useEffect } from 'react';
import { axiosInstance } from '../utils/axios';
import { refreshTokenApi } from '../api/auth';
import { clearUser, setUser } from '../store/features/auth/auth.slice';
  
export const AxiosInterceptor = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      config => {
        if (!token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error),
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;
        if (
          error.response.status === 401 &&
          !originalRequest._retry &&
          !originalRequest.url?.includes('/refresh-token')
        ) {
          originalRequest._retry = true;
          try {
            const res = await refreshTokenApi();
            const token = res.accessToken;
            dispatch(setUser(res));

            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          } catch (error) {
            dispatch(clearUser());
            return Promise.reject(error);
          }
        }
      },
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return <>{ children }</>;
};
