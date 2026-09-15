from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from services.maintenance_ai import MaintenancePredictor
from services.route_optimizer import RouteOptimizer
from services.document_analyzer import DocumentAnalyzer

router = APIRouter()

maintenance_predictor = MaintenancePredictor()
route_optimizer = RouteOptimizer()
document_analyzer = DocumentAnalyzer()


class MaintenanceRequest(BaseModel):
    vehicle_id: str
    mileage: float
    fuel_level: float
    engine_temp: float = 90.0
    oil_pressure: float = 40.0
    brake_wear: float = 50.0
    tire_pressure: float = 32.0


class RouteRequest(BaseModel):
    origin: dict
    destinations: List[dict]
    vehicle_capacity: float = 1000.0
    max_stops: int = 10


class DocumentRequest(BaseModel):
    document_type: str
    content: str


@router.post("/predict-maintenance")
async def predict_maintenance(request: MaintenanceRequest):
    try:
        prediction = maintenance_predictor.predict(
            mileage=request.mileage,
            fuel_level=request.fuel_level,
            engine_temp=request.engine_temp,
            oil_pressure=request.oil_pressure,
            brake_wear=request.brake_wear,
            tire_pressure=request.tire_pressure,
        )
        return {
            "vehicle_id": request.vehicle_id,
            "prediction": prediction,
            "device": "Snapdragon X Elite NPU",
            "model": "maintenance_predictor_v1",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/optimize-route")
async def optimize_route(request: RouteRequest):
    try:
        result = route_optimizer.optimize(
            origin=request.origin,
            destinations=request.destinations,
            vehicle_capacity=request.vehicle_capacity,
            max_stops=request.max_stops,
        )
        return {
            "optimized_route": result,
            "device": "Snapdragon X Elite NPU",
            "model": "route_optimizer_v1",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/analyze-document")
async def analyze_document(request: DocumentRequest):
    try:
        result = document_analyzer.analyze(
            document_type=request.document_type,
            content=request.content,
        )
        return {
            "analysis": result,
            "device": "Snapdragon X Elite NPU",
            "model": "document_analyzer_v1",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/models")
async def list_ai_models():
    return {
        "models": [
            {
                "name": "Whisper Base",
                "type": "speech-to-text",
                "source": "Qualcomm AI Hub",
                "use_case": "Voice commands",
                "optimized_for": "Snapdragon NPU",
            },
            {
                "name": "Maintenance Predictor",
                "type": "classification",
                "source": "Custom (ONNX)",
                "use_case": "Predictive maintenance",
                "optimized_for": "Snapdragon NPU",
            },
            {
                "name": "Route Optimizer",
                "type": "optimization",
                "source": "Custom",
                "use_case": "Intelligent routing",
                "optimized_for": "Snapdragon CPU/GPU",
            },
            {
                "name": "Document Analyzer",
                "type": "text-analysis",
                "source": "Custom (ONNX)",
                "use_case": "Transport document analysis",
                "optimized_for": "Snapdragon NPU",
            },
        ],
        "hardware": "Snapdragon X Elite",
        "npu_tops": 45,
    }
