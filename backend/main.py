from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import CORS_ORIGINS
from routes import vehicles, ai, dashboard, voice

app = FastAPI(
    title="Sarathi AI",
    description="On-Device Intelligent Business Transport Assistant - Snapdragon Optimized",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(vehicles.router, prefix="/api/vehicles", tags=["Vehicles"])
app.include_router(ai.router, prefix="/api/ai", tags=["AI Services"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(voice.router, prefix="/api/voice", tags=["Voice Assistant"])


@app.get("/")
async def root():
    return {
        "name": "Sarathi AI",
        "description": "On-Device Intelligent Business Transport Assistant",
        "optimization": "Snapdragon X Elite NPU (45 TOPS)",
        "status": "running",
    }


@app.get("/health")
async def health():
    return {"status": "healthy", "device": "Snapdragon X Elite", "npu": "active"}
