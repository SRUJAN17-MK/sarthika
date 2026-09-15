import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
MODELS_DIR = BASE_DIR / "ai_models"

DATA_DIR.mkdir(exist_ok=True)
MODELS_DIR.mkdir(exist_ok=True)

QUALCOMM_AI_HUB_API = "https://aihub.qualcomm.com/api/v1"
SNAPDRAGON_DEVICE = "Snapdragon X Elite"

AI_CONFIG = {
    "whisper_model": "base",
    "maintenance_model": "maintenance_predictor_v1",
    "route_model": "route_optimizer_v1",
    "document_model": "document_analyzer_v1",
    "npu_enabled": True,
    "device_target": "snapdragon_x_elite",
    "runtime": "onnx_qnn",
}

CORS_ORIGINS = ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"]
