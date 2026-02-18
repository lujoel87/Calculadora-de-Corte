import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Registro del Service Worker para soporte PWA y Offline
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Verificación crítica para Vercel:
    // Los Service Workers no se registran si la app está dentro de un iframe (vista previa de Vercel).
    if (window.self !== window.top) {
      console.warn('⚠️ El registro del Service Worker se omitió porque la app está en un iframe. Para probar la PWA, abre la URL de Vercel directamente en una pestaña nueva.');
    } else {
      // Usamos ruta absoluta /sw.js
      navigator.serviceWorker.register('/sw.js', { scope: '/' })
        .then(registration => {
          console.log('✅ PWA: Service Worker registrado con éxito en el scope:', registration.scope);
        })
        .catch(err => {
          console.error('❌ PWA: Error al registrar el Service Worker:', err.message);
        });
    }
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