import React, { useState, useEffect, useRef, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Navigation, MapPin, Truck, Fuel, Clock, Zap, X, RotateCcw, ChevronRight, Loader } from 'lucide-react'

const BANGALORE_CENTER = [12.9716, 77.5946]

const fallbackVehicles = [
  { id: 'V0001', name: 'Transporter A1', type: 'Truck', plate: 'KA-01-AB-1234', status: 'active', driver: 'Rajesh Kumar', fuel: 72, speed: 42, route: 'City Center - Tech Park', lat: 12.9716, lng: 77.5946, heading: 45 },
  { id: 'V0002', name: 'Carrier B2', type: 'Van', plate: 'KA-02-CD-5678', status: 'active', driver: 'Priya Sharma', fuel: 45, speed: 35, route: 'Industrial Area - Warehouse', lat: 12.9352, lng: 77.6245, heading: 120 },
  { id: 'V0003', name: 'Hauler C3', type: 'Truck', plate: 'KA-03-EF-9012', status: 'maintenance', driver: '', fuel: 88, speed: 0, route: 'Service Center', lat: 12.9600, lng: 77.6400, heading: 0 },
  { id: 'V0004', name: 'Courier D4', type: 'Van', plate: 'KA-04-GH-3456', status: 'active', driver: 'Amit Patel', fuel: 63, speed: 28, route: 'Hub - Residential Zone', lat: 13.0100, lng: 77.5800, heading: 210 },
  { id: 'V0005', name: 'Delivery E5', type: 'Bike', plate: 'KA-05-IJ-7890', status: 'idle', driver: 'Sanjay Verma', fuel: 91, speed: 0, route: '', lat: 12.9450, lng: 77.6100, heading: 0 },
  { id: 'V0006', name: 'Freighter F6', type: 'Truck', plate: 'KA-06-KL-1122', status: 'active', driver: 'Vikram Singh', fuel: 55, speed: 51, route: 'Port - Distribution Center', lat: 13.0250, lng: 77.6500, heading: 300 },
]

const statusColors = {
  active: '#10b981',
  maintenance: '#f59e0b',
  idle: '#64748b',
}

function createVehicleIcon(status, type) {
  const color = statusColors[status] || '#64748b'
  const emoji = type === 'Bike' ? '🏍' : type === 'Van' ? '🚐' : '🚛'
  return L.divIcon({
    className: 'vehicle-marker',
    html: `<div style="
      width:36px;height:36px;border-radius:50%;
      background:${color};border:3px solid white;
      box-shadow:0 2px 8px rgba(0,0,0,0.4);
      display:flex;align-items:center;justify-content:center;
      font-size:16px;position:relative;
    ">${emoji}<div style="
      position:absolute;bottom:-2px;right:-2px;
      width:10px;height:10px;border-radius:50%;
      background:white;border:2px solid ${color};
    "></div></div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  })
}

function createNavIcon() {
  return L.divIcon({
    className: 'nav-marker',
    html: `<div style="
      width:20px;height:20px;border-radius:50%;
      background:#3b82f6;border:3px solid white;
      box-shadow:0 0 12px rgba(59,130,246,0.6);
    "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  })
}

function MapEvents({ onMapClick }) {
  const map = useMap()
  useEffect(() => {
    map.on('click', (e) => onMapClick(e.latlng))
    return () => map.off('click', onMapClick)
  }, [map, onMapClick])
  return null
}

function FlyTo({ position }) {
  const map = useMap()
  useEffect(() => {
    if (position) map.flyTo(position, 15, { duration: 1.5 })
  }, [position, map])
  return null
}

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.asin(Math.sqrt(a))
}

function estimateTime(distanceKm) {
  const avgSpeed = 35
  const hours = distanceKm / avgSpeed
  if (hours < 1) return `${Math.round(hours * 60)} min`
  return `${Math.floor(hours)}h ${Math.round((hours % 1) * 60)}m`
}

function generateRoutePath(from, to, steps = 12) {
  const path = []
  const midLat = (from[0] + to[0]) / 2 + (Math.random() - 0.5) * 0.01
  const midLng = (from[1] + to[1]) / 2 + (Math.random() - 0.5) * 0.01
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const curve = Math.sin(t * Math.PI) * 0.003
    path.push([
      from[0] + (to[0] - from[0]) * t + curve * (Math.random() - 0.5),
      from[1] + (to[1] - from[1]) * t + curve * (Math.random() - 0.5),
    ])
  }
  return path
}

export default function LiveTracking() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [navDestination, setNavDestination] = useState(null)
  const [navRoute, setNavRoute] = useState(null)
  const [navInfo, setNavInfo] = useState(null)
  const [isNavigating, setIsNavigating] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [filter, setFilter] = useState('all')
  const intervalRef = useRef(null)
  const hasLoadedRef = useRef(false)

  const fetchLocations = useCallback(async () => {
    try {
      const res = await fetch('/api/tracking/locations')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setVehicles(data.vehicles)
      setLastUpdate(new Date())
    } catch {
      if (!hasLoadedRef.current) setVehicles(fallbackVehicles)
    } finally {
      hasLoadedRef.current = true
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLocations()
    intervalRef.current = setInterval(fetchLocations, 3000)
    return () => clearInterval(intervalRef.current)
  }, [fetchLocations])

  const activeVehicles = vehicles.filter((v) => v.status === 'active')

  const handleMapClick = useCallback(
    (latlng) => {
      if (isNavigating) return
      setNavDestination([latlng.lat, latlng.lng])
      setNavInfo(null)
      setNavRoute(null)
    },
    [isNavigating]
  )

  const startNavigation = useCallback(() => {
    if (!selectedVehicle || !navDestination) return
    const vehicle = vehicles.find((v) => v.id === selectedVehicle)
    if (!vehicle) return
    const from = [vehicle.lat, vehicle.lng]
    const path = generateRoutePath(from, navDestination)
    const totalDist = path.reduce((acc, p, i) => {
      if (i === 0) return 0
      return acc + haversineDistance(path[i - 1][0], path[i - 1][1], p[0], p[1])
    }, 0)
    setNavRoute(path)
    setNavInfo({
      distance: totalDist.toFixed(1),
      time: estimateTime(totalDist),
      steps: path.length,
    })
    setIsNavigating(true)
  }, [selectedVehicle, navDestination, vehicles])

  const stopNavigation = useCallback(() => {
    setIsNavigating(false)
    setNavRoute(null)
    setNavDestination(null)
    setNavInfo(null)
  }, [])

  const filteredVehicles = vehicles.filter((v) => filter === 'all' || v.status === filter)
  const selected = vehicles.find((v) => v.id === selectedVehicle)

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 48px)', gap: 0, margin: '-24px -32px' }}>
      {/* Sidebar */}
      <div
        style={{
          width: '320px',
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>
                Live Tracking
                {loading && <Loader size={14} style={{ marginLeft: '6px', animation: 'spin 1s linear infinite', verticalAlign: 'middle' }} />}
              </h2>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {activeVehicles.length} vehicles active
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--accent-green)',
                  animation: 'pulse 2s infinite',
                }}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {lastUpdate.toLocaleTimeString()}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            {['all', 'active', 'maintenance', 'idle'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  background: filter === f ? 'var(--accent-blue)' : 'var(--bg-card)',
                  color: filter === f ? 'white' : 'var(--text-secondary)',
                  transition: 'all 0.2s',
                }}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '8px' }}>
          {filteredVehicles.map((v) => (
            <div
              key={v.id}
              onClick={() => setSelectedVehicle(v.id)}
              style={{
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '4px',
                cursor: 'pointer',
                background: selectedVehicle === v.id ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                border: `1px solid ${selectedVehicle === v.id ? 'rgba(59, 130, 246, 0.3)' : 'transparent'}`,
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: statusColors[v.status],
                      boxShadow: v.status === 'active' ? `0 0 8px ${statusColors[v.status]}` : 'none',
                    }}
                  />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>{v.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{v.plate}</div>
                  </div>
                </div>
                {v.status === 'active' && (
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-cyan)' }}>
                      {Math.round(v.speed)} km/h
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      <Fuel size={10} style={{ marginRight: '2px' }} />
                      {v.fuel}%
                    </div>
                  </div>
                )}
                {v.status !== 'active' && (
                  <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
                )}
              </div>
              {v.driver && (
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px', paddingLeft: '20px' }}>
                  {v.driver}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation Panel */}
        {isNavigating && navInfo && (
          <div
            style={{
              padding: '16px',
              borderTop: '2px solid var(--accent-blue)',
              background: 'rgba(59, 130, 246, 0.08)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-blue)' }}>
                <Navigation size={14} style={{ marginRight: '6px' }} />
                Navigating
              </div>
              <button
                onClick={stopNavigation}
                style={{
                  background: 'var(--accent-red)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                <X size={12} /> End
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div style={{ background: 'var(--bg-card)', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent-cyan)' }}>{navInfo.distance} km</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Distance</div>
              </div>
              <div style={{ background: 'var(--bg-card)', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent-green)' }}>{navInfo.time}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>ETA</div>
              </div>
            </div>
          </div>
        )}

        {navDestination && !isNavigating && selectedVehicle && (
          <div
            style={{
              padding: '12px 16px',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              gap: '8px',
            }}
          >
            <button
              onClick={startNavigation}
              className="btn btn-primary"
              style={{ flex: 1, justifyContent: 'center' }}
            >
              <Navigation size={14} /> Start Navigation
            </button>
            <button
              onClick={() => { setNavDestination(null); setNavInfo(null); setNavRoute(null) }}
              className="btn btn-secondary"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Map */}
      <div style={{ flex: 1, position: 'relative' }}>
        <MapContainer
          center={BANGALORE_CENTER}
          zoom={12}
          style={{ width: '100%', height: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapEvents onMapClick={handleMapClick} />
          {selected && <FlyTo position={[selected.lat, selected.lng]} />}

          {filteredVehicles.map((v) => (
            <Marker
              key={v.id}
              position={[v.lat, v.lng]}
              icon={createVehicleIcon(v.status, v.type)}
              eventHandlers={{
                click: () => setSelectedVehicle(v.id),
              }}
            >
              <Popup>
                <div style={{ fontFamily: 'Inter, sans-serif', minWidth: '160px' }}>
                  <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '4px' }}>{v.name}</div>
                  <div style={{ fontSize: '11px', color: '#666', marginBottom: '6px' }}>{v.plate}</div>
                  <div style={{ fontSize: '12px' }}>
                    <div>Status: <b style={{ color: statusColors[v.status] }}>{v.status.toUpperCase()}</b></div>
                    {v.driver && <div>Driver: {v.driver}</div>}
                    {v.status === 'active' && <div>Speed: {Math.round(v.speed)} km/h</div>}
                    <div>Fuel: {v.fuel}%</div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {navDestination && (
            <Marker position={navDestination} icon={createNavIcon()}>
              <Popup>
                <div style={{ fontFamily: 'Inter, sans-serif' }}>
                  <b>Destination</b>
                  <div style={{ fontSize: '11px', color: '#666' }}>
                    {navDestination[0].toFixed(4)}, {navDestination[1].toFixed(4)}
                  </div>
                </div>
              </Popup>
            </Marker>
          )}

          {navRoute && (
            <Polyline
              positions={navRoute}
              pathOptions={{
                color: '#3b82f6',
                weight: 4,
                opacity: 0.8,
                dashArray: '10, 6',
              }}
            />
          )}
        </MapContainer>

        {/* Map Overlay Info */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            background: 'var(--bg-card)',
            borderRadius: '8px',
            padding: '10px 14px',
            border: '1px solid var(--border-color)',
            zIndex: 1000,
            fontSize: '12px',
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: '4px' }}>Bangalore Fleet</div>
          <div style={{ color: 'var(--text-muted)' }}>
            Click map to set destination | Select vehicle to start navigation
          </div>
        </div>

        {/* Quick Stats */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            display: 'flex',
            gap: '8px',
            zIndex: 1000,
          }}
        >
          {[
            { label: 'Active', value: activeVehicles.length, color: 'var(--accent-green)' },
            { label: 'Avg Speed', value: `${Math.round(activeVehicles.reduce((s, v) => s + v.speed, 0) / activeVehicles.length || 0)} km/h`, color: 'var(--accent-cyan)' },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                background: 'var(--bg-card)',
                borderRadius: '8px',
                padding: '8px 12px',
                border: '1px solid var(--border-color)',
              }}
            >
              <div style={{ fontSize: '14px', fontWeight: 700, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Vehicle Detail Card */}
        {selected && (
          <div
            style={{
              position: 'absolute',
              bottom: '16px',
              left: '16px',
              right: navDestination ? 'auto' : '16px',
              width: navDestination ? '280px' : 'auto',
              background: 'var(--bg-card)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid var(--border-color)',
              zIndex: 1000,
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: statusColors[selected.status],
                    boxShadow: selected.status === 'active' ? `0 0 8px ${statusColors[selected.status]}` : 'none',
                  }}
                />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700 }}>{selected.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{selected.plate}</div>
                </div>
              </div>
              <button
                onClick={() => setSelectedVehicle(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <X size={14} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '10px' }}>
              {selected.status === 'active' && (
                <div style={{ background: 'var(--bg-secondary)', borderRadius: '6px', padding: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent-cyan)' }}>{Math.round(selected.speed)}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>km/h</div>
                </div>
              )}
              <div style={{ background: 'var(--bg-secondary)', borderRadius: '6px', padding: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: selected.fuel < 30 ? 'var(--accent-red)' : 'var(--accent-green)' }}>
                  {selected.fuel}%
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Fuel</div>
              </div>
              {selected.driver && (
                <div style={{ background: 'var(--bg-secondary)', borderRadius: '6px', padding: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600 }}>{selected.driver.split(' ')[0]}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Driver</div>
                </div>
              )}
            </div>

            {selected.route && (
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                <MapPin size={12} style={{ marginRight: '4px' }} />
                {selected.route}
              </div>
            )}

            {!isNavigating && (
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', padding: '6px', background: 'var(--bg-secondary)', borderRadius: '6px' }}>
                Click on the map to set a destination
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
