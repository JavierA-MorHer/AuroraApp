import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import '@/design-system/global.css'
import Login from '@/routes/Login'
import App from './App'

const router = createBrowserRouter([
  { path: '/', element: <Login /> },
  { path: '/showcase', element: <App /> },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
