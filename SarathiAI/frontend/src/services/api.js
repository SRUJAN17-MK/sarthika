const API_BASE = '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('sarathi_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

function getAuthHeadersUpload() {
  const token = localStorage.getItem('sarathi_token');
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export const api = {
  async get(endpoint) {
    const res = await fetch(`${API_BASE}${endpoint}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    return res.json();
  },

  async post(endpoint, data) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    return res.json();
  },

  async upload(endpoint, file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: getAuthHeadersUpload(),
      body: formData,
    });
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    return res.json();
  },

  dashboard: {
    getStats: () => api.get('/dashboard/stats'),
    getActivity: () => api.get('/dashboard/activity'),
    getFleetOverview: () => api.get('/dashboard/fleet-overview'),
    getPerformance: () => api.get('/dashboard/performance'),
  },

  vehicles: {
    list: () => api.get('/vehicles/'),
    get: (id) => api.get(`/vehicles/${id}`),
    create: (data) => api.post('/vehicles/', data),
    update: (id, data) => api.post(`/vehicles/${id}`, data),
    delete: (id) => api.post(`/vehicles/${id}/delete`, {}),
    getMaintenance: (id) => api.get(`/vehicles/${id}/maintenance`),
  },

  ai: {
    predictMaintenance: (data) => api.post('/ai/predict-maintenance', data),
    optimizeRoute: (data) => api.post('/ai/optimize-route', data),
    analyzeDocument: (data) => api.post('/ai/analyze-document', data),
    listModels: () => api.get('/ai/models'),
  },

  voice: {
    processCommand: (data) => api.post('/voice/process', data),
    transcribe: (file) => api.upload('/voice/transcribe', file),
    listCommands: () => api.get('/voice/commands'),
    getStatus: () => api.get('/voice/status'),
  },
};
