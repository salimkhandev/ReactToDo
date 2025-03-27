import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// import App2 from './App2.jsx' 
import './index.css'
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(reg => console.log('Service Worker registered ✅', reg))
    .catch(err => console.log('Service Worker registration failed ❌', err));
}
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    {/* <App2/> */}
  </React.StrictMode>,
)
