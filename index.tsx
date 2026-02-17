import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App' // Le quitamos el .tsx al final para que sea más compatible

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
