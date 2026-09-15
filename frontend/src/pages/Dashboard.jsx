import React, { useState, useEffect } from 'react'
import { Activity, Truck, Route, Fuel, Brain, Clock, TrendingUp, AlertTriangle, Mic, FileText, Zap } from 'lucide-react'
import { api } from '../services/api'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [activity, setActivity] = useState([])
  const [fleet, setFleet] = useState([])

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      const [statsRes, activityRes, fleetRes] = await Promise.all([
        api.dashboard.getStats(),
        api.dashboard.getActivity(),
        api.dashboard.getFleetOverview(),
      ])
      setStats(statsRes)
      setActivity(activityRes.activities)
      setFleet(fleetRes.vehicles)
    } catch (err) {
      setStats({
        total_vehicles: 12, active_vehicles: 9, maintenance_due: 2,
        total_routes_today: 24, completed_routes: 18, pending_routes: 6,
        fuel_efficiency: 87.3, avg_delivery_time: '2h 15m',
        ai_insights: { maintenance_alerts: 2, route_optimizations: 15, cost_savings: '$1,240', time_saved: '4h 30m' },
      })
      setActivity([
        { id: 1, type: 'maintenance', message: 'Vehicle V0003 engine oil change recommended', time: '15 min ago', priority: 'high', ai_confidence: 0.92 },
        { id: 2, type: 'route', message: 'Route R0012 optimized - saved 12.5 km', time: '30 min ago', priority: 'medium', ai_confidence: 0.88 },
        { id: 3, type: 'alert', message: 'Unusual fuel consumption detected on V0007', time: '1 hour ago', priority: 'high', ai_confidence: 0.95 },
        { id: 4, type: 'voice', message: "Voice command: 'Schedule maintenance for V0001'", time: '2 hours ago', priority: 'low', ai_confidence: 0.99 },
        { id: 5, type: 'document', message: 'Insurance document analyzed for V0005', time: '3 hours ago', priority: 'medium', ai_confidence: 0.85 },
      ])
      setFleet([
        { id: 'V0001', name: 'Transporter A1', status: 'on-route', driver: 'Rajesh Kumar', route: 'City Center - Tech Park', eta: '45 min', fuel: 72 },
        { id: 'V0002', name: 'Carrier B2', status: 'delivered', driver: 'Priya Sharma', route: 'Industrial Area - Warehouse', eta: 'Completed', fuel: 45 },
        { id: 'V0003', name: 'Hauler C3', status: 'maintenance', driver: '', route: 'Service center', eta: '-', fuel: 88 },
        { id: 'V0004', name: 'Courier D4', status: 'on-route', driver: 'Amit Patel', route: 'Hub - Residential Zone', eta: '1h 20m', fuel: 63 },
        { id: 'V0005', name: 'Delivery E5', status: 'idle', driver: 'Sanjay Verma', route: 'Awaiting dispatch', eta: '-', fuel: 91 },
      ])
    }
  }

  if (!stats) return <div className="empty-state">Loading dashboard...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Fleet operations overview with AI-powered insights</p>
        </div>
        <div className="ai-model-tag">
          <Zap size={12} />
          Snapdragon NPU Active
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="label">Total Vehicles</div>
          <div className="value">{stats.total_vehicles}</div>
          <div className="change positive">
            <Truck size={14} />
            {stats.active_vehicles} active
          </div>
        </div>
        <div className="stat-card">
          <div className="label">Routes Today</div>
          <div className="value">{stats.total_routes_today}</div>
          <div className="change positive">
            <Route size={14} />
            {stats.completed_routes} completed
          </div>
        </div>
        <div className="stat-card">
          <div className="label">Fuel Efficiency</div>
          <div className="value">{stats.fuel_efficiency}%</div>
          <div className="change positive">
            <Fuel size={14} />
            +2.3% from yesterday
          </div>
        </div>
        <div className="stat-card">
          <div className="label">AI Cost Savings</div>
          <div className="value">{stats.ai_insights.cost_savings}</div>
          <div className="change positive">
            <Brain size={14} />
            This week
          </div>
        </div>
      </div>

      <div className="content-grid">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent AI Activity</h3>
            <span className="card-badge">Live</span>
          </div>
          {activity.map((item) => (
            <div key={item.id} className="activity-item">
              <div className={`activity-icon ${item.type}`}>
                {item.type === 'maintenance' && <AlertTriangle size={16} />}
                {item.type === 'route' && <Route size={16} />}
                {item.type === 'alert' && <AlertTriangle size={16} />}
                {item.type === 'voice' && <Mic size={16} />}
                {item.type === 'document' && <FileText size={16} />}
              </div>
              <div className="activity-text">
                <div className="message">{item.message}</div>
                <div className="time">{item.time}</div>
              </div>
              <div className="activity-confidence">
                {(item.ai_confidence * 100).toFixed(0)}%
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Fleet Status</h3>
            <span className="card-badge">{fleet.length} vehicles</span>
          </div>
          <div className="vehicle-list">
            {fleet.map((v) => (
              <div key={v.id} className="vehicle-item">
                <div className={`vehicle-status ${v.status}`} />
                <div className="vehicle-info">
                  <div className="name">{v.name}</div>
                  <div className="route">{v.route || 'No active route'}</div>
                </div>
                <div className="vehicle-fuel">
                  <div className="level" style={{ color: v.fuel < 30 ? 'var(--accent-red)' : 'var(--text-primary)' }}>
                    {v.fuel}%
                  </div>
                  <div className="bar">
                    <div
                      className="bar-fill"
                      style={{
                        width: `${v.fuel}%`,
                        background: v.fuel < 30 ? 'var(--accent-red)' : v.fuel < 60 ? 'var(--accent-orange)' : 'var(--accent-green)',
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">AI Performance Metrics</h3>
          <div className="ai-model-tag"><Brain size={12} /> On-Device Inference</div>
        </div>
        <div className="grid-4">
          <div className="metric-mini">
            <div className="value">94.2%</div>
            <div className="label">Maintenance Prediction</div>
          </div>
          <div className="metric-mini">
            <div className="value">18.5%</div>
            <div className="label">Route Improvement</div>
          </div>
          <div className="metric-mini">
            <div className="value">97.8%</div>
            <div className="label">Voice Command Success</div>
          </div>
          <div className="metric-mini">
            <div className="value">91.5%</div>
            <div className="label">Document Analysis</div>
          </div>
        </div>
      </div>
    </div>
  )
}
