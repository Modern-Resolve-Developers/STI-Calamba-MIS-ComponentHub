import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import Initialization from './router'
import reportWebVitals from './reportWebVitals';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './index.css'
import './components/PasswordStrengthMeter/PasswordStrengthMeter.css'
import { QueryClient, QueryClientProvider } from "react-query";
import ToastProvider from './core/context/ToastContext';
import { GlobalProvider } from './core/context/GlobalContext';
import ControlledToast from './components/Toast/Toastify';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const queryClient = new QueryClient({});

root.render(
  <HashRouter>
    <QueryClientProvider client={queryClient}>
    <ToastProvider>
      <GlobalProvider>
        
        <ControlledToast
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
          <Initialization />
        
      </GlobalProvider>
      </ToastProvider>
    </QueryClientProvider>
  </HashRouter>
)
reportWebVitals();