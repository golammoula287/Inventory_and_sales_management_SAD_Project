import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        {/* Toaster available globally */}
        <Toaster position="top-right" reverseOrder={false} />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)

