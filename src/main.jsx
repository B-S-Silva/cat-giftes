import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Tema claro/escuro automático baseado no sistema
const mq = window.matchMedia('(prefers-color-scheme: dark)');
const applyTheme = (e) => {
  document.documentElement.classList.toggle('dark', e.matches);
};
applyTheme(mq);
try { mq.addEventListener('change', applyTheme); } catch { mq.addListener(applyTheme); }

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
