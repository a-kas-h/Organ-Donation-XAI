from pydantic import BaseModel, Field
from typing import Optional

class DonorData(BaseModel):
    Donor_Age: int
    Donor_Weight: float

class RecipientData(BaseModel):
    Patient_Age: int
    Patient_BMI: float
    Patient_Weight: float
    Biological_Markers: float
    RealTime_Organ_HealthScore: float
    Risk_Score: float

class PredictionRequest(BaseModel):
    donor: DonorData
    recipient: RecipientData
