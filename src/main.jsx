import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '../i18n.js'
import { ThemeProviderAntd } from './contexts/ThemeProviderAntd.jsx';


const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProviderAntd>
          <App />
        </ThemeProviderAntd>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)
