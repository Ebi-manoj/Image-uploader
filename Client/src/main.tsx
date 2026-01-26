import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { Toaster } from 'sonner';
import { Provider } from 'react-redux';
import appStore from './store/store.ts';
import { AuthProvider } from './components/AuthProvider.tsx';
import { setupAxiosInterceptors } from './utils/axios.ts';

// Setup axios interceptors with Redux store
setupAxiosInterceptors(appStore);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={appStore}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </Provider>
      <Toaster position="top-center" richColors={false} />
    </BrowserRouter>
  </StrictMode>,
);
