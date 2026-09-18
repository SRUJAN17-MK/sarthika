# Sarathi AI - On-Device Intelligent Business Transport Assistant

**Snapdragon AI Lab Build & Present Challenge**

## Overview

Sarathi AI is an on-device intelligent business transport assistant optimized for Snapdragon-powered HP PCs. It uses Qualcomm AI Hub models and custom AI inference to provide predictive maintenance, route optimization, voice commands, and document analysis — all running locally on the device's NPU for maximum privacy and performance.

## Key Features

### 1. Predictive Maintenance AI
- Analyzes sensor data (engine temp, oil pressure, brake wear, tire pressure)
- Predicts component health scores
- Generates maintenance recommendations
- **Model:** Custom ONNX classifier optimized for Snapdragon NPU

### 2. Intelligent Route Optimization
- Multi-stop route planning with greedy + 2-opt optimization
- Fuel-efficient path calculation
- Real-time distance and time estimation
- **Algorithm:** Haversine distance + 2-opt local search

### 3. Voice Transport Assistant
- Speech-to-text using Whisper (Qualcomm AI Hub)
- Natural language command processing
- Vehicle, route, and maintenance voice commands
- **Model:** Whisper Base (optimized for Snapdragon NPU)

### 4. Document Analysis
- Insurance policy extraction
- Transport permit validation
- Invoice and receipt processing
- Vehicle registration analysis
- **Model:** Custom NER + classification (ONNX)

## Target Hardware

- **Processor:** Snapdragon X Elite
- **NPU:** Hexagon NPU (45 TOPS)
- **RAM:** 16GB+ LPDDR5X
- **OS:** Windows 11 (Copilot+ PC)
- **Device Examples:** HP OmniBook X, HP EliteBook 6 G1

## Qualcomm AI Hub Integration

| Model | Type | Source | Optimized For |
|-------|------|--------|---------------|
| Whisper Base | Speech-to-Text | Qualcomm AI Hub | Snapdragon NPU |
| Custom ONNX | Classification | Custom | Snapdragon NPU |
| 2-Opt Algorithm | Optimization | Custom | Snapdragon CPU/GPU |
| NER Model | Text Analysis | Custom | Snapdragon NPU |

## Tech Stack

### Backend
- **Framework:** FastAPI (Python)
- **AI Runtime:** ONNX Runtime + Qualcomm AI Engine Direct
- **Models:** Qualcomm AI Hub, custom ONNX

### Frontend
- **Framework:** React 18 + Vite
- **UI:** Custom CSS (dark theme, responsive)
- **Charts:** Recharts

### AI/ML
- **Speech:** Whisper (Qualcomm AI Hub)
- **Vision:** ONNX models
- **Optimization:** Custom algorithms
- **Inference:** Snapdragon NPU acceleration

## Architecture

```
┌─────────────────────────────────────────────────┐
│              Sarathi AI Dashboard               │
│         (React + Vite on Snapdragon PC)         │
├─────────────────────────────────────────────────┤
│                    API Layer                     │
│              (FastAPI Backend)                   │
├─────────────────────────────────────────────────┤
│              AI Service Layer                    │
├──────────┬──────────┬───────────┬──────────────┤
│Whisper   │Maint.    │Route      │Document      │
│Voice     │Predictor │Optimizer  │Analyzer      │
├──────────┴──────────┴───────────┴──────────────┤
│          Snapdragon X Elite NPU                 │
│           (45 TOPS Hexagon DSP)                 │
│         Qualcomm AI Engine Direct               │
└─────────────────────────────────────────────────┘
```

## Privacy & Performance

- **100% On-Device:** All AI inference runs locally
- **No Cloud Required:** Works offline after model loading
- **Low Latency:** ~8-12ms inference on NPU
- **Power Efficient:** NPU uses minimal battery
- **Data Privacy:** Transportation data never leaves the device

## Getting Started

### Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and proxies API requests to the backend on port 8000.

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/dashboard/stats` | GET | Dashboard statistics |
| `/api/vehicles/` | GET | List all vehicles |
| `/api/ai/predict-maintenance` | POST | Run maintenance prediction |
| `/api/ai/optimize-route` | POST | Optimize delivery route |
| `/api/ai/analyze-document` | POST | Analyze transport document |
| `/api/voice/process` | POST | Process voice command |
| `/api/voice/transcribe` | POST | Transcribe audio file |

## Challenge Alignment

| Criteria | Implementation |
|----------|---------------|
| AI Use Case | Transportation management with predictive analytics |
| Snapdragon Optimization | Hexagon NPU inference, 45 TOPS acceleration |
| On-Device AI | All models run locally, no cloud dependency |
| Privacy | Sensitive transport data stays on-device |
| Open Source Models | Whisper (Qualcomm AI Hub), custom ONNX |
| Demo Ready | Full web dashboard with interactive AI features |

## Project Structure

```
SarathiAI/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── config.py               # Configuration
│   ├── requirements.txt        # Python dependencies
│   ├── routes/                 # API routes
│   │   ├── vehicles.py         # Vehicle management
│   │   ├── ai.py               # AI service endpoints
│   │   ├── dashboard.py        # Dashboard data
│   │   └── voice.py            # Voice assistant
│   ├── services/               # AI service implementations
│   │   ├── maintenance_ai.py   # Predictive maintenance
│   │   ├── route_optimizer.py  # Route optimization
│   │   ├── document_analyzer.py # Document analysis
│   │   └── voice_assistant.py  # Voice command processing
│   └── data/                   # Demo data
├── frontend/
│   ├── src/
│   │   ├── App.jsx             # Main app with routing
│   │   ├── index.css           # Global styles
│   │   ├── pages/              # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Vehicles.jsx
│   │   │   ├── AIInsights.jsx
│   │   │   ├── VoiceAssistant.jsx
│   │   │   ├── RouteOptimizer.jsx
│   │   │   └── DocumentAnalysis.jsx
│   │   └── services/
│   │       └── api.js          # API client
│   └── package.json
└── README.md
```

## Demo Flow

1. **Dashboard:** View fleet overview, AI activity, and performance metrics
2. **Fleet:** Manage vehicles with status tracking
3. **AI Insights:** Run predictive maintenance analysis
4. **Voice:** Issue voice commands for hands-free management
5. **Routes:** Optimize delivery routes with AI
6. **Documents:** Analyze transport documents automatically

## License

Built for Snapdragon AI Lab Build & Present Challenge 2026
