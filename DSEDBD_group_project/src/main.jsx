import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { setupInterceptors } from './api/interceptors'
import App from './App.jsx'

setupInterceptors()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
