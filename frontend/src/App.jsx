import React from 'react'
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, Truck, Brain, Mic, Map, FileText, Settings, Zap, Navigation } from 'lucide-react'
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

      <div className="device-badge">
        <div className="chip">Powered by</div>
        <div className="name">Snapdragon X Elite</div>
        <div className="tops">45 TOPS NPU | On-Device AI</div>
      </div>
    </aside>
  )
}

function App() {
  return (
    <Router>
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
    </Router>
  )
}

export default App
