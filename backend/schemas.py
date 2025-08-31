from pydantic import BaseModel
from typing import List, Dict, Optional

class DetailedAnalysis(BaseModel):
    overview: str
    detection_details: str
    recommendations: str
    important_notes: str
    next_steps: str

class APIOutput(BaseModel):
    disease: str 
    overview: str
    symptoms: List[str]
    causes: List[str]
    treatments: List[str]
    probability: float
    time: str
    detailed_analysis: Optional[DetailedAnalysis] = None

class DetectionResponse(BaseModel):
    success: bool
    result: APIOutput
    message: str = ""
