import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './features/auth/authApi'; // must import before App to set up dev mock fetch + vamosp2Config
import { App } from './app/App';

const rootEl = document.getElementById('vamos-p2-root') ?? document.getElementById('root');
if (!rootEl) throw new Error('Root element not found');

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
