import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Registration from './pages/Registration'
import ApplicationStatus from './pages/ApplicationStatus'
import EditDetails from './pages/EditDetails'
import AdminDashboard from './pages/AdminDashboard'
import StoredVoters from './pages/StoredVoters'
import VerificationQueue from './pages/VerificationQueue'
import DuplicateAttempts from './pages/DuplicateAttempts'

const RequireAdmin = ({ children }) => {
  const session = localStorage.getItem('adminSession')
  if (!session) return <Navigate to="/login" replace />
  return children
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />

        {/* User routes — open, no guard (matches original behaviour) */}
        <Route path="/register" element={<Registration />} />
        <Route path="/status" element={<ApplicationStatus />} />
        <Route path="/edit" element={<EditDetails />} />
        <Route path="/edit/:voterId" element={<EditDetails />} />

        {/* Admin routes — protected */}
        <Route path="/admin" element={
          <RequireAdmin><AdminDashboard /></RequireAdmin>
        } />
        <Route path="/admin/voters" element={
          <RequireAdmin><StoredVoters /></RequireAdmin>
        } />
        <Route path="/admin/verification" element={
          <RequireAdmin><VerificationQueue /></RequireAdmin>
        } />
        <Route path="/admin/duplicates" element={
          <RequireAdmin><DuplicateAttempts /></RequireAdmin>
        } />
      </Routes>
    </Router>
  )
}

export default App
