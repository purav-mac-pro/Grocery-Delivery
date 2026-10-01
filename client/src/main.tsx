
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter } from 'react-router-dom' //import browser-router
import { CartProvider } from './context/CartContext.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { NotificationProvider } from './context/NotificationContext.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AuthProvider>
    <NotificationProvider>
        <CartProvider>
            <App />
        </CartProvider>
    </NotificationProvider>
</AuthProvider>
  </BrowserRouter>,
)
