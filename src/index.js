// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Escudo contra errores de extensiones de Chrome (onMessage, etc)
window.addEventListener('error', (e) => {
    if (e.filename?.includes('chrome-extension') || e.message?.includes('onMessage')) {
        e.stopImmediatePropagation();
    }
});

window.addEventListener('unhandledrejection', (e) => {
    if (e.reason?.stack?.includes('chrome-extension')) {
        e.stopImmediatePropagation();
    }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
