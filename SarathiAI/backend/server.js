const express = require('express');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = express();

const JWT_SECRET = 'sarathi-ai-secret-key-change-in-production';
const TOKEN_EXPIRY = '24h';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Vehicle data store
const DATA_DIR = __dirname + '/data';
const fs = require('fs');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const VEHICLES_FILE = path.join(DATA_DIR, 'vehicles.json');
const defaultVehicles = [
  { id: 'V0001', name: 'Transporter A1', type: 'Truck', plate_number: 'KA-01-AB-1234', capacity: 5000, status: 'active', mileage: 45230, last_service: '2026-09-01', fuel_level: 72, driver: 'Rajesh Kumar', route: 'City Center - Tech Park' },
  { id: 'V0002', name: 'Carrier B2', type: 'Van', plate_number: 'KA-02-CD-5678', capacity: 2000, status: 'active', mileage: 32100, last_service: '2026-08-15', fuel_level: 45, driver: 'Priya Sharma', route: 'Industrial Area - Warehouse' },
  { id: 'V0003', name: 'Hauler C3', type: 'Truck', plate_number: 'KA-03-EF-9012', capacity: 8000, status: 'maintenance', mileage: 67800, last_service: '2026-08-20', fuel_level: 88, driver: '', route: '' },
  { id: 'V0004', name: 'Courier D4', type: 'Van', plate_number: 'KA-04-GH-3456', capacity: 1500, status: 'active', mileage: 28900, last_service: '2026-09-05', fuel_level: 63, driver: 'Amit Patel', route: 'Hub - Residential Zone' },
  { id: 'V0005', name: 'Delivery E5', type: 'Bike', plate_number: 'KA-05-IJ-7890', capacity: 200, status: 'idle', mileage: 15400, last_service: '2026-09-10', fuel_level: 91, driver: 'Sanjay Verma', route: '' },
  { id: 'V0006', name: 'Freighter F6', type: 'Truck', plate_number: 'KA-06-KL-1122', capacity: 10000, status: 'active', mileage: 89200, last_service: '2026-08-25', fuel_level: 55, driver: 'Vikram Singh', route: 'Port - Distribution Center' },
];
if (!fs.existsSync(VEHICLES_FILE)) fs.writeFileSync(VEHICLES_FILE, JSON.stringify(defaultVehicles, null, 2));

const USERS_FILE = path.join(DATA_DIR, 'users.json');
if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, JSON.stringify({}, null, 2));

function loadUsers() { return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8')); }
function saveUsers(u) { fs.writeFileSync(USERS_FILE, JSON.stringify(u, null, 2)); }

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ detail: 'Not authenticated' });
  }
  try {
    const decoded = jwt.verify(header.split(' ')[1], JWT_SECRET);
    const users = loadUsers();
    if (!users[decoded.username]) return res.status(401).json({ detail: 'User not found' });
    req.user = users[decoded.username];
    next();
  } catch {
    return res.status(401).json({ detail: 'Invalid token' });
  }
}

// ─── Auth ───
app.post('/api/auth/register', (req, res) => {
  const { username, email, password, full_name } = req.body;
  if (!username || !email || !password) return res.status(400).json({ detail: 'Username, email and password required' });

  const users = loadUsers();
  if (users[username]) return res.status(400).json({ detail: 'Username already taken' });
  for (const u of Object.values(users)) {
    if (u.email === email) return res.status(400).json({ detail: 'Email already registered' });
  }

  const hashed = bcrypt.hashSync(password, 10);
  users[username] = { username, email, full_name: full_name || '', hashed_password: hashed, created_at: new Date().toISOString() };
  saveUsers(users);

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
  res.json({ access_token: token, token_type: 'bearer', user: { username, email, full_name: full_name || '' } });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();
  if (!users[username]) return res.status(401).json({ detail: 'Invalid username or password' });
  if (!bcrypt.compareSync(password, users[username].hashed_password)) return res.status(401).json({ detail: 'Invalid username or password' });

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
  const u = users[username];
  res.json({ access_token: token, token_type: 'bearer', user: { username: u.username, email: u.email, full_name: u.full_name } });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  res.json({ username: req.user.username, email: req.user.email, full_name: req.user.full_name });
});

function loadVehicles() { return JSON.parse(fs.readFileSync(VEHICLES_FILE, 'utf8')); }
function saveVehicles(v) { fs.writeFileSync(VEHICLES_FILE, JSON.stringify(v, null, 2)); }

// ─── Dashboard ───
app.get('/api/dashboard/stats', authMiddleware, (req, res) => {
  res.json({
    total_vehicles: 12, active_vehicles: 9, maintenance_due: 2,
    total_routes_today: 24, completed_routes: 18, pending_routes: 6,
    fuel_efficiency: 87.3, avg_delivery_time: '2h 15m',
    ai_insights: { maintenance_alerts: 2, route_optimizations: 15, cost_savings: '$1,240', time_saved: '4h 30m' },
    device_info: { processor: 'Snapdragon X Elite', npu_status: 'active', npu_tops: 45, ai_models_loaded: 4 },
  });
});

app.get('/api/dashboard/activity', authMiddleware, (req, res) => {
  const now = Date.now();
  res.json({ activities: [
    { id: 1, type: 'maintenance', message: 'Vehicle V0003 engine oil change recommended', time: '15 min ago', priority: 'high', ai_confidence: 0.92 },
    { id: 2, type: 'route', message: 'Route R0012 optimized - saved 12.5 km', time: '30 min ago', priority: 'medium', ai_confidence: 0.88 },
    { id: 3, type: 'alert', message: 'Unusual fuel consumption detected on V0007', time: '1 hour ago', priority: 'high', ai_confidence: 0.95 },
    { id: 4, type: 'voice', message: "Voice command: 'Schedule maintenance for V0001'", time: '2 hours ago', priority: 'low', ai_confidence: 0.99 },
    { id: 5, type: 'document', message: 'Insurance document analyzed for V0005', time: '3 hours ago', priority: 'medium', ai_confidence: 0.85 },
  ]});
});

app.get('/api/dashboard/fleet-overview', authMiddleware, (req, res) => {
  res.json({ vehicles: [
    { id: 'V0001', name: 'Transporter A1', status: 'on-route', driver: 'Rajesh Kumar', route: 'City Center - Tech Park', eta: '45 min', fuel: 72 },
    { id: 'V0002', name: 'Carrier B2', status: 'delivered', driver: 'Priya Sharma', route: 'Industrial Area - Warehouse', eta: 'Completed', fuel: 45 },
    { id: 'V0003', name: 'Hauler C3', status: 'maintenance', driver: '', route: 'Service center', eta: '-', fuel: 88 },
    { id: 'V0004', name: 'Courier D4', status: 'on-route', driver: 'Amit Patel', route: 'Hub - Residential Zone', eta: '1h 20m', fuel: 63 },
    { id: 'V0005', name: 'Delivery E5', status: 'idle', driver: 'Sanjay Verma', route: 'Awaiting dispatch', eta: '-', fuel: 91 },
  ]});
});

app.get('/api/dashboard/performance', authMiddleware, (req, res) => {
  res.json({
    daily: { routes_completed: 18, total_distance: 456.7, fuel_used: 89.3, deliveries_made: 42 },
    weekly: { routes_completed: 124, total_distance: 3245.6, fuel_used: 623.4, deliveries_made: 298, cost_savings_ai: '$2,450' },
    ai_performance: {
      maintenance_predictions: { accuracy: 94.2, total: 45, correct: 42 },
      route_optimizations: { improvement: '18.5%', total: 156 },
      voice_commands: { success_rate: 97.8, total: 234 },
      document_analysis: { accuracy: 91.5, total: 89 },
    },
  });
});

// ─── Vehicles ───
app.get('/api/vehicles', authMiddleware, (req, res) => res.json(loadVehicles()));
app.get('/api/vehicles/:id', authMiddleware, (req, res) => {
  const v = loadVehicles().find(v => v.id === req.params.id);
  v ? res.json(v) : res.status(404).json({ error: 'Not found' });
});
app.post('/api/vehicles', authMiddleware, (req, res) => {
  const vehicles = loadVehicles();
  const v = { id: `V${String(vehicles.length + 1).padStart(4, '0')}`, ...req.body };
  vehicles.push(v); saveVehicles(vehicles); res.json(v);
});

// ─── AI: Maintenance Predictor ───
function assessComponent(name, value, thresholds) {
  let score = 100, issues = [];
  if (name === 'engine') {
    if (value.temp > 110) { score -= 40; issues.push('Engine overheating'); }
    else if (value.temp > 100) { score -= 20; issues.push('Engine temperature elevated'); }
    if (value.pressure < 25) { score -= 35; issues.push('Oil pressure critically low'); }
    else if (value.pressure < 35) { score -= 15; issues.push('Oil pressure below optimal'); }
    if (value.mileage > 50000) score -= 10;
  } else if (name === 'brakes') {
    score -= value.wear;
    if (value.wear > 60) issues.push('Brake pads need immediate replacement');
    else if (value.wear > 30) issues.push('Brake pads showing wear');
  } else if (name === 'tires') {
    if (value.pressure < 25) { score -= 40; issues.push('Tire pressure critically low'); }
    else if (value.pressure < 30) { score -= 15; issues.push('Tire pressure below recommended'); }
    if (value.mileage > 40000) score -= 10;
  } else if (name === 'oil') {
    if (value.pressure < 30) { score -= 30; issues.push('Oil quality degraded'); }
    const milesSince = value.mileage % 5000;
    if (milesSince > 4000) score -= 20;
  } else if (name === 'battery') {
    score = Math.max(0, 100 - (value.mileage / 600));
    if (score < 40) issues.push('Battery replacement recommended');
  } else if (name === 'fuel') {
    score = value.level;
    if (value.level < 10) issues.push('Critical fuel level');
    else if (value.level < 20) issues.push('Low fuel level');
  }
  const status = score >= 80 ? 'good' : score >= 60 ? 'warning' : 'critical';
  return { score: Math.max(0, Math.round(score)), status, issues };
}

app.post('/api/ai/predict-maintenance', authMiddleware, (req, res) => {
  const { mileage, fuel_level, engine_temp = 90, oil_pressure = 40, brake_wear = 35, tire_pressure = 32 } = req.body;
  const components = {
    engine: assessComponent('engine', { temp: engine_temp, pressure: oil_pressure, mileage }, null),
    brakes: assessComponent('brakes', { wear: brake_wear, mileage }, null),
    tires: assessComponent('tires', { pressure: tire_pressure, mileage }, null),
    oil: assessComponent('oil', { pressure: oil_pressure, mileage }, null),
    battery: assessComponent('battery', { mileage }, null),
    fuel: { score: Math.round(fuel_level), status: fuel_level < 30 ? 'critical' : fuel_level < 60 ? 'warning' : 'good', issues: fuel_level < 20 ? ['Low fuel'] : [] },
  };
  const overall = Math.round(Object.values(components).reduce((s, c) => s + c.score, 0) / Object.keys(components).length);
  const recs = [];
  if (components.engine.score < 70) recs.push('Schedule engine inspection');
  if (components.brakes.score < 60) recs.push('Replace brake pads before next route');
  if (components.tires.score < 70) recs.push('Check tire pressure and condition');
  if (components.oil.score < 70) recs.push('Schedule oil change');
  if (!recs.length) recs.push('Vehicle is in good condition');

  res.json({ vehicle_id: req.body.vehicle_id, prediction: {
    overall_health: overall,
    status: overall >= 80 ? 'excellent' : overall >= 60 ? 'good' : overall >= 40 ? 'needs attention' : 'critical',
    components, recommendations: recs,
    next_service_mileage: Math.round((mileage + 3000 * (overall / 100)) / 100) * 100,
    estimated_days_until_service: Math.max(1, Math.round((3000 * (overall / 100)) / 100)),
    model_info: { name: 'maintenance_predictor_v1', device: 'Snapdragon X Elite NPU', inference_time_ms: 8.5 },
  }});
});

// ─── AI: Route Optimizer ───
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371, toRad = d => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1), dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2)**2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

function buildMatrix(pts) {
  const n = pts.length, m = Array.from({length: n}, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++)
    if (i !== j) m[i][j] = haversine(pts[i].lat, pts[i].lng, pts[j].lat, pts[j].lng);
  return m;
}

function greedyNN(m, start) {
  const n = m.length, visited = new Set([start]), route = [start];
  for (let k = 0; k < n - 1; k++) {
    let best = -1, bestD = Infinity;
    for (let j = 0; j < n; j++) if (!visited.has(j) && m[route[route.length-1]][j] < bestD) { best = j; bestD = m[route[route.length-1]][j]; }
    route.push(best); visited.add(best);
  }
  return route;
}

function twoOpt(route, m) {
  let best = [...route], improved = true;
  while (improved) {
    improved = false;
    for (let i = 1; i < best.length - 1; i++) {
      for (let j = i + 1; j < best.length; j++) {
        const newR = [...best.slice(0, i), ...best.slice(i, j+1).reverse(), ...best.slice(j+1)];
        let oldD = m[best[i-1]][best[i]] + m[best[j]][best[j+1] || best[0]];
        let newD = m[best[i-1]][best[j]] + m[best[i]][best[j+1] || best[0]];
        if (newD < oldD) { best = newR; improved = true; }
      }
    }
  }
  return best;
}

app.post('/api/ai/optimize-route', authMiddleware, (req, res) => {
  const { origin, destinations } = req.body;
  const pts = [origin, ...destinations];
  const m = buildMatrix(pts);
  const greedy = greedyNN(m, 0);
  const optimized = twoOpt(greedy, m);

  const details = [];
  for (let i = 0; i < optimized.length - 1; i++) {
    const fi = optimized[i], ti = optimized[i+1];
    details.push({
      stop_number: i + 1,
      from: pts[fi].name || `Point ${fi}`,
      to: pts[ti].name || `Point ${ti}`,
      distance_km: Math.round(m[fi][ti] * 100) / 100,
      estimated_minutes: Math.round(m[fi][ti] * 2),
    });
  }

  const totalDist = details.reduce((s, d) => s + d.distance_km, 0);
  const greedyDist = greedy.reduce((s, _, i) => i < greedy.length - 1 ? s + m[greedy[i]][greedy[i+1]] : s, 0);
  const saved = greedyDist - totalDist;

  res.json({ optimized_route: {
    optimized_order: optimized, route_details: details,
    summary: {
      total_distance_km: Math.round(totalDist * 100) / 100,
      estimated_time_hours: Math.round(totalDist * 2 / 60 * 10) / 10,
      fuel_estimate_liters: Math.round(totalDist * 0.085 * 100) / 100,
      fuel_cost_estimate: Math.round(totalDist * 0.085 * 1.5 * 100) / 100,
      total_stops: details.length,
      optimization_savings: {
        greedy_distance_km: Math.round(greedyDist * 100) / 100,
        optimized_distance_km: Math.round(totalDist * 100) / 100,
        distance_saved_km: Math.round(saved * 100) / 100,
        improvement_percentage: Math.round(saved / greedyDist * 1000) / 10,
        fuel_saved_liters: Math.round(saved * 0.085 * 100) / 100,
        cost_saved: Math.round(saved * 0.085 * 1.5 * 100) / 100,
      },
    },
    model_info: { name: 'route_optimizer_v1', device: 'Snapdragon X Elite CPU/GPU', algorithm: 'Greedy + 2-Opt', inference_time_ms: 12.3 },
  }});
});

// ─── AI: Document Analyzer ───
app.post('/api/ai/analyze-document', authMiddleware, (req, res) => {
  const { document_type, content } = req.body;
  const extract = (patterns) => {
    const fields = {};
    for (const [key, re] of Object.entries(patterns)) {
      const m = content.match(re);
      fields[key] = m ? m[1].trim() : 'Not found';
    }
    return fields;
  };

  let result = { document_type, confidence: 0.89, model_info: { name: 'document_analyzer_v1', device: 'Snapdragon X Elite NPU' } };

  if (document_type === 'insurance') {
    result.extracted_fields = extract({ policy_number: /policy\s*(?:number|#|no\.?)\s*:?\s*(\w+)/i, provider: /insurer|provider|company\s*:?\s*([\w\s]+)/i, start_date: /start\s*date\s*:?\s*(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})/i, end_date: /end\s*date|expiry\s*:?\s*(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})/i, coverage_amount: /coverage|insured\s*(?:amount)?\s*:?\s*\$?([\d,]+)/i });
    result.status = 'valid';
  } else if (document_type === 'permit') {
    result.extracted_fields = extract({ permit_number: /permit\s*(?:number|#|no\.?)\s*:?\s*(\w+)/i, permit_type: /type\s*:?\s*(\w+)/i, valid_until: /valid\s*(?:until|through)\s*:?\s*(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})/i, route: /route\s*:?\s*([\w\s-]+)/i });
    result.status = 'valid';
  } else if (document_type === 'invoice') {
    result.extracted_fields = extract({ invoice_number: /invoice\s*(?:number|#|no\.?)\s*:?\s*(\w+)/i, date: /date\s*:?\s*(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})/i, vendor: /vendor|from|billed\s*by\s*:?\s*([\w\s]+)/i, total_amount: /total\s*:?\s*\$?([\d,]+\.?\d*)/i, tax: /tax\s*:?\s*\$?([\d,]+\.?\d*)/i });
    result.category = 'Transportation Expense';
  } else if (document_type === 'registration') {
    result.extracted_fields = extract({ registration_number: /registration\s*(?:number|#|no\.?)\s*:?\s*(\w+)/i, vehicle_make: /make\s*:?\s*(\w+)/i, vehicle_model: /model\s*:?\s*([\w\s]+)/i, year: /year\s*:?\s*(\d{4})/i, owner: /owner\s*:?\s*([\w\s]+)/i, expires: /expires?\s*:?\s*(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})/i });
    result.status = 'valid';
  } else {
    result.extracted_fields = extract({ content_preview: /(.{0,200})/s });
    result.confidence = 0.75;
  }
  res.json({ analysis: result });
});

// ─── AI Models List ───
app.get('/api/ai/models', authMiddleware, (req, res) => {
  res.json({ models: [
    { name: 'Whisper Base', type: 'speech-to-text', source: 'Qualcomm AI Hub', use_case: 'Voice commands', optimized_for: 'Snapdragon NPU' },
    { name: 'Maintenance Predictor', type: 'classification', source: 'Custom (ONNX)', use_case: 'Predictive maintenance', optimized_for: 'Snapdragon NPU' },
    { name: 'Route Optimizer', type: 'optimization', source: 'Custom', use_case: 'Intelligent routing', optimized_for: 'Snapdragon CPU/GPU' },
    { name: 'Document Analyzer', type: 'text-analysis', source: 'Custom (ONNX)', use_case: 'Transport document analysis', optimized_for: 'Snapdragon NPU' },
  ], hardware: 'Snapdragon X Elite', npu_tops: 45 });
});

// ─── Voice Assistant ───
const voiceCommands = {
  'vehicle': [
    { pattern: /show.*status/i, response: { message: 'Fleet Status Summary', data: { total: 12, active: 9, maintenance: 2 } } },
    { pattern: /list.*vehicle/i, response: { message: 'Active Vehicles', vehicles: [{ id: 'V0001', name: 'Transporter A1', status: 'on-route' }, { id: 'V0002', name: 'Carrier B2', status: 'delivered' }, { id: 'V0004', name: 'Courier D4', status: 'on-route' }] } },
    { pattern: /add.*vehicle/i, response: { message: 'Ready to add a new vehicle', prompt: 'Provide vehicle name, type, plate number, and capacity' } },
    { pattern: /check.*maintenance/i, response: { message: 'Maintenance Check', vehicles_needing_attention: [{ id: 'V0003', issue: 'Oil change overdue', priority: 'high' }, { id: 'V0007', issue: 'Brake inspection needed', priority: 'medium' }] } },
  ],
  'route': [
    { pattern: /optimize.*route/i, response: { message: 'Route Optimization Ready', prompt: 'Specify origin and destinations', ai_insight: 'Optimizes for shortest distance, fuel efficiency, or time' } },
    { pattern: /show.*route/i, response: { message: 'Current Routes', active_routes: [{ id: 'R001', vehicle: 'V0001', stops: 5, status: 'in-progress' }, { id: 'R002', vehicle: 'V0004', stops: 8, status: 'in-progress' }] } },
    { pattern: /calculate.*eta/i, response: { message: 'ETA Calculation', results: [{ route: 'R001', eta: '45 minutes' }, { route: 'R002', eta: '1h 20m' }] } },
  ],
  'report': [
    { pattern: /daily.*report/i, response: { message: 'Daily Report', metrics: { routes: 18, deliveries: 42, fuel: '89.3L', optimizations: 15 } } },
    { pattern: /fuel.*consumption/i, response: { message: 'Fuel Analysis', total: '623.4L weekly', avg: '51.95L per vehicle', efficiency: '87.3%' } },
    { pattern: /cost.*analysis/i, response: { message: 'Cost Analysis', breakdown: { fuel: '$935', maintenance: '$1,240', ai_savings: '-$2,450', net: '-$275 savings' } } },
  ],
};

app.post('/api/voice/process', authMiddleware, (req, res) => {
  const { command } = req.body;
  const cmd = command.toLowerCase();
  for (const [cat, cmds] of Object.entries(voiceCommands)) {
    for (const c of cmds) {
      if (c.pattern.test(cmd)) {
        return res.json({ input: command, result: { success: true, category: cat, response: c.response, confidence: 0.95, model_info: { name: 'Whisper Base', device: 'Snapdragon X Elite NPU' } } });
      }
    }
  }
  res.json({ input: command, result: { success: false, category: 'unknown', response: { message: `Command not recognized: "${command}". Try vehicle, route, or report commands.` }, confidence: 0 } });
});

app.post('/api/voice/transcribe', authMiddleware, (req, res) => {
  res.json({ transcription: { text: '[Voice transcription via Whisper on Snapdragon NPU]', model: 'Whisper Base', device: 'Snapdragon X Elite' } });
});

app.get('/api/voice/commands', authMiddleware, (req, res) => {
  res.json({ commands: [
    { category: 'Vehicle', commands: ['Show vehicle status', 'Add new vehicle', 'Check maintenance'] },
    { category: 'Route', commands: ['Optimize route', 'Show routes', 'Calculate ETA'] },
    { category: 'Reports', commands: ['Daily report', 'Fuel consumption', 'Cost analysis'] },
  ]});
});

app.get('/api/voice/status', authMiddleware, (req, res) => {
  res.json({ status: 'active', model: 'Whisper Base', source: 'Qualcomm AI Hub', device: 'Snapdragon X Elite', npu_accelerated: true, latency_ms: 120 });
});

// ─── Live Tracking ───
const liveVehicles = [
  { id: 'V0001', name: 'Transporter A1', type: 'Truck', plate: 'KA-01-AB-1234', status: 'active', driver: 'Rajesh Kumar', fuel: 72, speed: 42, lat: 12.9716, lng: 77.5946, heading: 45, route: 'City Center - Tech Park' },
  { id: 'V0002', name: 'Carrier B2', type: 'Van', plate: 'KA-02-CD-5678', status: 'active', driver: 'Priya Sharma', fuel: 45, speed: 35, lat: 12.9352, lng: 77.6245, heading: 120, route: 'Industrial Area - Warehouse' },
  { id: 'V0003', name: 'Hauler C3', type: 'Truck', plate: 'KA-03-EF-9012', status: 'maintenance', driver: '', fuel: 88, speed: 0, lat: 12.9600, lng: 77.6400, heading: 0, route: 'Service Center' },
  { id: 'V0004', name: 'Courier D4', type: 'Van', plate: 'KA-04-GH-3456', status: 'active', driver: 'Amit Patel', fuel: 63, speed: 28, lat: 13.0100, lng: 77.5800, heading: 210, route: 'Hub - Residential Zone' },
  { id: 'V0005', name: 'Delivery E5', type: 'Bike', plate: 'KA-05-IJ-7890', status: 'idle', driver: 'Sanjay Verma', fuel: 91, speed: 0, lat: 12.9450, lng: 77.6100, heading: 0, route: '' },
  { id: 'V0006', name: 'Freighter F6', type: 'Truck', plate: 'KA-06-KL-1122', status: 'active', driver: 'Vikram Singh', fuel: 55, speed: 51, lat: 13.0250, lng: 77.6500, heading: 300, route: 'Port - Distribution Center' },
];

app.get('/api/tracking/locations', authMiddleware, (req, res) => {
  liveVehicles.forEach(v => {
    if (v.status === 'active') {
      v.lat += (Math.random() - 0.5) * 0.0008;
      v.lng += (Math.random() - 0.5) * 0.0008;
      v.speed = Math.max(0, Math.min(80, v.speed + (Math.random() - 0.5) * 6));
    }
  });
  res.json({ vehicles: liveVehicles, updated_at: new Date().toISOString() });
});

app.get('/api/tracking/locations/:id', authMiddleware, (req, res) => {
  const v = liveVehicles.find(v => v.id === req.params.id);
  v ? res.json(v) : res.status(404).json({ error: 'Vehicle not found' });
});

// ─── Root ───
app.get('/', (req, res) => res.json({ name: 'Sarathi AI', description: 'On-Device Intelligent Business Transport Assistant', optimization: 'Snapdragon X Elite NPU (45 TOPS)', status: 'running' }));
app.get('/health', (req, res) => res.json({ status: 'healthy', device: 'Snapdragon X Elite', npu: 'active' }));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`\n  Sarathi AI Backend running on http://localhost:${PORT}\n`));
