import { Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthStore } from './store/authStore'
import { Layout } from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Bankroll from './pages/Bankroll'
import { Bets } from './pages/Bets'
import { CreateBet } from './pages/CreateBet'
import Analytics from './pages/Analytics'
import Parlays from './pages/Parlays'
import CreateParlay from './pages/CreateParlay'

const queryClient = new QueryClient()

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Navigate to="/" />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/bankroll"
        element={
          <ProtectedRoute>
            <Layout>
              <Bankroll />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/bets"
        element={
          <ProtectedRoute>
            <Layout>
              <Bets />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/bets/create"
        element={
          <ProtectedRoute>
            <Layout>
              <CreateBet />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Layout>
              <Analytics />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/parlays"
        element={
          <ProtectedRoute>
            <Layout>
              <Parlays />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/parlays/create"
        element={
          <ProtectedRoute>
            <Layout>
              <CreateParlay />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRoutes />
    </QueryClientProvider>
  )
}

export default App
