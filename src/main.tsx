import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/fonts.css';
import './styles/main.css';
import './styles/event.css';
import App from './App';

// Agentation persists its settings without handling storage write failures.
// Keep the optional development toolbar from interrupting the invitation.
function canUseToolbarStorage() {
  const key = `agentation:storage-check:${Date.now()}`;
  try {
    for (const storage of [window.localStorage, window.sessionStorage]) {
      storage.setItem(key, '1');
      storage.removeItem(key);
    }
    return true;
  } catch {
    return false;
  }
}

const Agentation = import.meta.env.DEV && canUseToolbarStorage()
  ? React.lazy(() => import('agentation').then((module) => ({ default: module.Agentation })))
  : null;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    {Agentation && (
      <React.Suspense fallback={null}>
        <Agentation appName="Маленький секрет" />
      </React.Suspense>
    )}
  </React.StrictMode>,
);
