import React from 'react'
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Truck, Brain, Mic, Map, FileText, Navigation, LogOut, User } from 'lucide-react'
import { AuthProvider, useAuth } from './AuthContext'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Dashboard from './pages/Dashboard'
import Vehicles from './pages/Vehicles'
import AIInsights from './pages/AIInsights'
import VoiceAssistant from './pages/VoiceAssistant'
import RouteOptimizer from './pages/RouteOptimizer'
import DocumentAnalysis from './pages/DocumentAnalysis'
import LiveTracking from './pages/LiveTracking'

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/vehicles', label: 'Fleet', icon: Truck },
  { path: '/live', label: 'Live Tracking', icon: Navigation },
  { path: '/ai', label: 'AI Insights', icon: Brain },
  { path: '/voice', label: 'Voice', icon: Mic },
  { path: '/routes', label: 'Routes', icon: Map },
  { path: '/documents', label: 'Documents', icon: FileText },
]

function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-icon">S</div>
        <div>
          <div className="logo-text">Sarathi AI</div>
          <div className="logo-sub">Smart Transport</div>
        </div>
      </div>

      <nav>
        <div className="nav-section">
          <div className="nav-title">Navigation</div>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <item.icon />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            <User size={16} />
          </div>
          <div className="user-details">
            <div className="user-name">{user?.full_name || user?.username}</div>
            <div className="user-email">{user?.email}</div>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={16} />
          Logout
        </button>
      </div>

      <div className="device-badge">
        <div className="chip">Powered by</div>
        <div className="name">Snapdragon X Elite</div>
        <div className="tops">45 TOPS NPU | On-Device AI</div>
      </div>
    </aside>
  )
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <div className="auth-logo-icon" style={{ margin: '0 auto 16px' }}>S</div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function AppLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/live" element={<LiveTracking />} />
          <Route path="/ai" element={<AIInsights />} />
          <Route path="/voice" element={<VoiceAssistant />} />
          <Route path="/routes" element={<RouteOptimizer />} />
          <Route path="/documents" element={<DocumentAnalysis />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
