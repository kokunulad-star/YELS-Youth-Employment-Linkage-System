import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import useAuthStore from './store/authStore'

// Pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Opportunities from './pages/Opportunities'
import OpportunityDetail from './pages/OpportunityDetail'
import YouthDashboard from './pages/dashboards/YouthDashboard'
import PosterDashboard from './pages/dashboards/PosterDashboard'
import AdminDashboard from './pages/dashboards/AdminDashboard'
import Notifications from './pages/Notifications'
import Messages from './pages/Messages'

function App() {
  const { user } = useAuthStore()

  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/opportunities/:id" element={<OpportunityDetail />} />

        {/* Smart redirect based on role */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            {user?.role === 'youth' && <Navigate to="/dashboard/youth" />}
            {user?.role === 'admin' && <Navigate to="/dashboard/admin" />}
            {(user?.role === 'investor' || user?.role === 'organization') && <Navigate to="/dashboard/poster" />}
          </ProtectedRoute>
        } />

        {/* Protected: Youth */}
        <Route path="/dashboard/youth" element={
          <ProtectedRoute roles={['youth']}>
            <YouthDashboard />
          </ProtectedRoute>
        } />

        {/* Protected: Investor / Organization */}
        <Route path="/dashboard/poster" element={
          <ProtectedRoute roles={['investor', 'organization']}>
            <PosterDashboard />
          </ProtectedRoute>
        } />

        {/* Protected: Admin */}
        <Route path="/dashboard/admin" element={
          <ProtectedRoute roles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        {/* Protected: All logged-in */}
        <Route path="/notifications" element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        } />
        <Route path="/messages" element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
