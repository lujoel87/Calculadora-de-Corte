import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Registro del Service Worker para soporte PWA y Offline
// Usamos una ruta relativa simple para evitar problemas de origen en entornos de preview
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js', { scope: './' })
      .then(registration => {
        console.log('SW registrado con éxito: ', registration.scope);
      })
      .catch(err => {
        // Si el error persiste en este entorno, imprimimos detalles para diagnóstico
        console.error('Error al registrar el SW (PWA):', err.message);
      });
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);