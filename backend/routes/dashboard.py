from fastapi import APIRouter
from datetime import datetime, timedelta
import random

router = APIRouter()


@router.get("/stats")
async def get_dashboard_stats():
    return {
        "total_vehicles": 12,
        "active_vehicles": 9,
        "maintenance_due": 2,
        "total_routes_today": 24,
        "completed_routes": 18,
        "pending_routes": 6,
        "fuel_efficiency": 87.3,
        "avg_delivery_time": "2h 15m",
        "ai_insights": {
            "maintenance_alerts": 2,
            "route_optimizations": 15,
            "cost_savings": "$1,240",
            "time_saved": "4h 30m",
        },
        "device_info": {
            "processor": "Snapdragon X Elite",
            "npu_status": "active",
            "npu_tops": 45,
            "battery_impact": "minimal",
            "ai_models_loaded": 4,
        },
    }


@router.get("/activity")
async def get_recent_activity():
    now = datetime.now()
    activities = [
        {
            "id": 1,
            "type": "maintenance",
            "message": "Vehicle V0003 engine oil change recommended",
            "time": (now - timedelta(minutes=15)).isoformat(),
            "priority": "high",
            "ai_confidence": 0.92,
        },
        {
            "id": 2,
            "type": "route",
            "message": "Route R0012 optimized - saved 12.5 km",
            "time": (now - timedelta(minutes=30)).isoformat(),
            "priority": "medium",
            "ai_confidence": 0.88,
        },
        {
            "id": 3,
            "type": "alert",
            "message": "Unusual fuel consumption detected on V0007",
            "time": (now - timedelta(hours=1)).isoformat(),
            "priority": "high",
            "ai_confidence": 0.95,
        },
        {
            "id": 4,
            "type": "voice",
            "message": "Voice command processed: 'Schedule maintenance for V0001'",
            "time": (now - timedelta(hours=2)).isoformat(),
            "priority": "low",
            "ai_confidence": 0.99,
        },
        {
            "id": 5,
            "type": "document",
            "message": "Insurance document analyzed for V0005 - expires in 30 days",
            "time": (now - timedelta(hours=3)).isoformat(),
            "priority": "medium",
            "ai_confidence": 0.85,
        },
    ]
    return {"activities": activities}


@router.get("/fleet-overview")
async def get_fleet_overview():
    return {
        "vehicles": [
            {
                "id": "V0001",
                "name": "Transporter A1",
                "status": "on-route",
                "location": {"lat": 12.9716, "lng": 77.5946},
                "fuel": 72,
                "driver": "Rajesh Kumar",
                "route": "City Center - Tech Park",
                "eta": "45 min",
            },
            {
                "id": "V0002",
                "name": "Carrier B2",
                "status": "delivered",
                "location": {"lat": 12.2958, "lng": 76.6394},
                "fuel": 45,
                "driver": "Priya Sharma",
                "route": "Industrial Area - Warehouse",
                "eta": "Completed",
            },
            {
                "id": "V0003",
                "name": "Hauler C3",
                "status": "maintenance",
                "location": {"lat": 13.0827, "lng": 80.2707},
                "fuel": 88,
                "driver": "",
                "route": "",
                "eta": "Service center",
            },
            {
                "id": "V0004",
                "name": "Courier D4",
                "status": "on-route",
                "location": {"lat": 17.3850, "lng": 78.4867},
                "fuel": 63,
                "driver": "Amit Patel",
                "route": "Hub - Residential Zone",
                "eta": "1h 20m",
            },
            {
                "id": "V0005",
                "name": "Delivery E5",
                "status": "idle",
                "location": {"lat": 19.0760, "lng": 72.8777},
                "fuel": 91,
                "driver": "Sanjay Verma",
                "route": "",
                "eta": "Awaiting dispatch",
            },
        ]
    }


@router.get("/performance")
async def get_performance_metrics():
    return {
        "daily": {
            "routes_completed": 18,
            "total_distance": 456.7,
            "fuel_used": 89.3,
            "deliveries_made": 42,
            "avg_time_per_delivery": "18 min",
        },
        "weekly": {
            "routes_completed": 124,
            "total_distance": 3245.6,
            "fuel_used": 623.4,
            "deliveries_made": 298,
            "cost_savings_ai": "$2,450",
        },
        "ai_performance": {
            "maintenance_predictions": {"accuracy": 94.2, "total": 45, "correct": 42},
            "route_optimizations": {"improvement": "18.5%", "total": 156},
            "voice_commands": {"success_rate": 97.8, "total": 234},
            "document_analysis": {"accuracy": 91.5, "total": 89},
        },
    }
