from pydantic import BaseModel
from typing import List

class APIOutput(BaseModel):
    disease: str 
    overview: str
    symptoms: List[str]
    causes: List[str]
    treatments: List[str]
    probability: float
    time: str

class DetectionResponse(BaseModel):
    success: bool
    result: APIOutput
    message: str = ""
