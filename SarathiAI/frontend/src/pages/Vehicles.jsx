import React, { useState, useEffect } from 'react'
import { Plus, Search, Settings, Fuel, MapPin, Clock, Wrench } from 'lucide-react'

const demoVehicles = [
  { id: 'V0001', name: 'Transporter A1', type: 'Truck', plate: 'KA-01-AB-1234', capacity: 5000, status: 'active', mileage: 45230, fuel: 72, driver: 'Rajesh Kumar', route: 'City Center - Tech Park' },
  { id: 'V0002', name: 'Carrier B2', type: 'Van', plate: 'KA-02-CD-5678', capacity: 2000, status: 'active', mileage: 32100, fuel: 45, driver: 'Priya Sharma', route: 'Industrial Area - Warehouse' },
  { id: 'V0003', name: 'Hauler C3', type: 'Truck', plate: 'KA-03-EF-9012', capacity: 8000, status: 'maintenance', mileage: 67800, fuel: 88, driver: '', route: '' },
  { id: 'V0004', name: 'Courier D4', type: 'Van', plate: 'KA-04-GH-3456', capacity: 1500, status: 'active', mileage: 28900, fuel: 63, driver: 'Amit Patel', route: 'Hub - Residential Zone' },
  { id: 'V0005', name: 'Delivery E5', type: 'Bike', plate: 'KA-05-IJ-7890', capacity: 200, status: 'idle', mileage: 15400, fuel: 91, driver: 'Sanjay Verma', route: '' },
  { id: 'V0006', name: 'Freighter F6', type: 'Truck', plate: 'KA-06-KL-1122', capacity: 10000, status: 'active', mileage: 89200, fuel: 55, driver: 'Vikram Singh', route: 'Port - Distribution Center' },
]

export default function Vehicles() {
  const [vehicles, setVehicles] = useState(demoVehicles)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const filtered = vehicles.filter((v) => {
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.plate.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || v.status === filter
    return matchSearch && matchFilter
  })

  const statusColors = {
    active: 'var(--accent-green)',
    maintenance: 'var(--accent-orange)',
    idle: 'var(--text-muted)',
    delivered: 'var(--accent-blue)',
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Fleet Management</h1>
          <p className="page-subtitle">{vehicles.length} vehicles registered</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Add Vehicle
        </button>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            className="form-input"
            placeholder="Search vehicles by name or plate..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '36px' }}
          />
        </div>
        <select className="form-select" value={filter} onChange={(e) => setFilter(e.target.value)} style={{ width: '150px' }}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="maintenance">Maintenance</option>
          <option value="idle">Idle</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '16px' }}>
        {filtered.map((v) => (
          <div key={v.id} className="card" style={{ cursor: 'pointer' }} onClick={() => setSelectedVehicle(v)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 600 }}>{v.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{v.plate}</div>
              </div>
              <span style={{
                padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
                background: `${statusColors[v.status]}20`, color: statusColors[v.status],
              }}>
                {v.status.toUpperCase()}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                <Wrench size={12} style={{ marginRight: '4px' }} />
                {v.mileage.toLocaleString()} km
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                <Fuel size={12} style={{ marginRight: '4px' }} />
                {v.fuel}%
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                <MapPin size={12} style={{ marginRight: '4px' }} />
                {v.type}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                <Clock size={12} style={{ marginRight: '4px' }} />
                {v.capacity} kg
              </div>
            </div>

            <div className="vehicle-fuel">
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

            {v.driver && (
              <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                Driver: {v.driver}
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedVehicle && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000,
        }} onClick={() => setSelectedVehicle(null)}>
          <div className="card" style={{ width: '500px', maxHeight: '80vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div className="card-header">
              <h3 className="card-title">{selectedVehicle.name}</h3>
              <button className="btn btn-secondary" onClick={() => setSelectedVehicle(null)}>Close</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <div className="form-label">Plate Number</div>
                <div style={{ fontSize: '14px' }}>{selectedVehicle.plate}</div>
              </div>
              <div className="form-group">
                <div className="form-label">Type</div>
                <div style={{ fontSize: '14px' }}>{selectedVehicle.type}</div>
              </div>
              <div className="form-group">
                <div className="form-label">Mileage</div>
                <div style={{ fontSize: '14px' }}>{selectedVehicle.mileage.toLocaleString()} km</div>
              </div>
              <div className="form-group">
                <div className="form-label">Capacity</div>
                <div style={{ fontSize: '14px' }}>{selectedVehicle.capacity} kg</div>
              </div>
              <div className="form-group">
                <div className="form-label">Fuel Level</div>
                <div style={{ fontSize: '14px' }}>{selectedVehicle.fuel}%</div>
              </div>
              <div className="form-group">
                <div className="form-label">Driver</div>
                <div style={{ fontSize: '14px' }}>{selectedVehicle.driver || 'Unassigned'}</div>
              </div>
            </div>
            {selectedVehicle.route && (
              <div className="form-group">
                <div className="form-label">Current Route</div>
                <div style={{ fontSize: '14px' }}>{selectedVehicle.route}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
