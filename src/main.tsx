import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '@/design-system/global.css'
import Login from '@/routes/Login'
import Home from '@/routes/Home'
import Lessons from '@/routes/Lessons'
import Rewards from '@/routes/Rewards'
import Profile from '@/routes/Profile'
import App from './App'
import { useAuthStore } from '@/stores/useAuthStore'
import { ProtectedRoute, GuestRoute } from '@/features/auth/components/AuthGuard'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})

const router = createBrowserRouter([
  {
    path: '/',
    element: <GuestRoute><Login /></GuestRoute>,
  },
  {
    path: '/home',
    element: <ProtectedRoute><Home /></ProtectedRoute>,
  },
  {
    path: '/lessons',
    element: <ProtectedRoute><Lessons /></ProtectedRoute>,
  },
  {
    path: '/rewards',
    element: <ProtectedRoute><Rewards /></ProtectedRoute>,
  },
  {
    path: '/profile',
    element: <ProtectedRoute><Profile /></ProtectedRoute>,
  },
  {
    path: '/showcase',
    element: <App />,
  },
])

function Root() {
  const init = useAuthStore((s) => s.init)
  useEffect(() => init(), [init])
  return <RouterProvider router={router} />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Root />
    </QueryClientProvider>
  </StrictMode>
)
