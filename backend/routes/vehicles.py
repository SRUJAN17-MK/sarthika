from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import json
from pathlib import Path

router = APIRouter()

DATA_FILE = Path(__file__).resolve().parent.parent / "data" / "vehicles.json"


class Vehicle(BaseModel):
    id: Optional[str] = None
    name: str
    type: str
    plate_number: str
    capacity: float
    status: str = "active"
    mileage: float = 0
    last_service: str = ""
    fuel_level: float = 100.0
    driver: str = ""
    route: str = ""


class MaintenanceRecord(BaseModel):
    vehicle_id: str
    date: str
    type: str
    description: str
    cost: float
    mileage_at_service: float


def load_vehicles():
    if DATA_FILE.exists():
        return json.loads(DATA_FILE.read_text())
    return []


def save_vehicles(vehicles):
    DATA_FILE.write_text(json.dumps(vehicles, indent=2))


@router.get("/")
async def list_vehicles():
    return load_vehicles()


@router.get("/{vehicle_id}")
async def get_vehicle(vehicle_id: str):
    vehicles = load_vehicles()
    for v in vehicles:
        if v["id"] == vehicle_id:
            return v
    raise HTTPException(status_code=404, detail="Vehicle not found")


@router.post("/")
async def create_vehicle(vehicle: Vehicle):
    vehicles = load_vehicles()
    vehicle.id = f"V{len(vehicles) + 1:04d}"
    vehicles.append(vehicle.model_dump())
    save_vehicles(vehicles)
    return vehicle


@router.put("/{vehicle_id}")
async def update_vehicle(vehicle_id: str, vehicle: Vehicle):
    vehicles = load_vehicles()
    for i, v in enumerate(vehicles):
        if v["id"] == vehicle_id:
            vehicle.id = vehicle_id
            vehicles[i] = vehicle.model_dump()
            save_vehicles(vehicles)
            return vehicle
    raise HTTPException(status_code=404, detail="Vehicle not found")


@router.delete("/{vehicle_id}")
async def delete_vehicle(vehicle_id: str):
    vehicles = load_vehicles()
    vehicles = [v for v in vehicles if v["id"] != vehicle_id]
    save_vehicles(vehicles)
    return {"message": "Vehicle deleted"}


@router.get("/{vehicle_id}/maintenance")
async def get_maintenance_history(vehicle_id: str):
    maintenance_file = Path(__file__).resolve().parent.parent / "data" / "maintenance.json"
    if maintenance_file.exists():
        records = json.loads(maintenance_file.read_text())
        return [r for r in records if r["vehicle_id"] == vehicle_id]
    return []
