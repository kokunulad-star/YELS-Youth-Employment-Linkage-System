import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import useAuthStore from './store/authStore'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Opportunities from './pages/Opportunities'
import OpportunityDetail from './pages/OpportunityDetail'
import Messages from './pages/Messages'
import Notifications from './pages/Notifications'
import YouthDashboard from './pages/dashboards/YouthDashboard'
import OrgDashboard from './pages/dashboards/PosterDashboard'
import AdminDashboard from './pages/dashboards/AdminDashboard'

function DashRedirect() {
  const { user } = useAuthStore()
  if (user?.role === 'youth') return <Navigate to="/dashboard/youth" replace />
  if (user?.role === 'admin') return <Navigate to="/dashboard/admin" replace />
  if (user?.role === 'organization') return <Navigate to="/dashboard/org" replace />
  return <Navigate to="/" replace />
}

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/opportunities/:id" element={<OpportunityDetail />} />
        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashRedirect /></ProtectedRoute>} />
        <Route path="/dashboard/youth" element={<ProtectedRoute roles={['youth']}><YouthDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/org" element={<ProtectedRoute roles={['organization']}><OrgDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App
