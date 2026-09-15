from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import Optional
from services.voice_assistant import VoiceAssistant

router = APIRouter()
voice_assistant = VoiceAssistant()


class VoiceCommand(BaseModel):
    command: str
    context: Optional[str] = "general"


class TextToProcess(BaseModel):
    text: str
    language: str = "en"


@router.post("/process")
async def process_voice_command(request: VoiceCommand):
    try:
        result = voice_assistant.process_command(
            command=request.command,
            context=request.context,
        )
        return {
            "input": request.command,
            "result": result,
            "device": "Snapdragon X Elite NPU",
            "model": "Whisper Base (Qualcomm AI Hub)",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    try:
        audio_content = await file.read()
        result = voice_assistant.transcribe(audio_content)
        return {
            "transcription": result,
            "device": "Snapdragon X Elite NPU",
            "model": "Whisper Base",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/commands")
async def list_available_commands():
    return {
        "commands": [
            {
                "category": "Vehicle Management",
                "commands": [
                    "Show vehicle status",
                    "Add new vehicle",
                    "Check vehicle maintenance",
                    "Update vehicle mileage",
                ],
            },
            {
                "category": "Route Management",
                "commands": [
                    "Optimize route",
                    "Show current routes",
                    "Add new destination",
                    "Calculate ETA",
                ],
            },
            {
                "category": "Maintenance",
                "commands": [
                    "Schedule maintenance",
                    "Check maintenance history",
                    "Predict next service",
                    "Generate maintenance report",
                ],
            },
            {
                "category": "Reports",
                "commands": [
                    "Generate daily report",
                    "Show fuel consumption",
                    "Display cost analysis",
                    "Export fleet data",
                ],
            },
        ]
    }


@router.get("/status")
async def voice_system_status():
    return {
        "status": "active",
        "model": "Whisper Base",
        "source": "Qualcomm AI Hub",
        "language": "English",
        "device": "Snapdragon X Elite",
        "npu_accelerated": True,
        "latency_ms": 120,
    }
