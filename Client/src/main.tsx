import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { Toaster } from 'sonner';
import { Provider } from 'react-redux';
import appStore from './store/store.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={appStore}>
        <App />
      </Provider>
      <Toaster position="top-center" richColors={false} />
    </BrowserRouter>
  </StrictMode>,
);
