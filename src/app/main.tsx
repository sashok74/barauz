import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './i18n';
import { worker } from '../data/msw/browser';

async function enableMocking() {
  if (import.meta.env.MODE === 'test') {
    return;
  }

  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}

enableMocking()
  .then(() => {
    const rootElement = document.getElementById('root');
    if (!rootElement) throw new Error('Root element not found');

    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  })
  .catch((error) => {
    console.error('Failed to start MSW:', error);
  });
