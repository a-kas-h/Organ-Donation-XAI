from fastapi import FastAPI, HTTPException
import joblib
import pandas as pd
import numpy as np
import os
from .schemas import PredictionRequest

app = FastAPI(title="Organ Donation Match ML Service")

# Paths to models
MODEL_PATH = os.path.join(os.path.dirname(__file__), "../models/kidney_model.pkl")
SCALER_PATH = os.path.join(os.path.dirname(__file__), "../models/scaler.pkl")
FEATURES_PATH = os.path.join(os.path.dirname(__file__), "../models/features.pkl") # Optional, to double check feature order

# Global variables for models
model = None
scaler = None

@app.on_event("startup")
def load_models():
    global model, scaler
    try:
        model = joblib.load(MODEL_PATH)
        scaler = joblib.load(SCALER_PATH)
        print("✅ Models loaded successfully")
    except Exception as e:
        print(f"❌ Error loading models: {e}")
        # In production, might want to exit here if models fail to load

@app.post("/predict-match")
def predict_match(request: PredictionRequest):
    print(f"🧠 ML Service Received Request for Donor: {request.donor.Donor_Age} yrs, {request.donor.Donor_Weight} kg")
    if not model or not scaler:
        raise HTTPException(status_code=503, detail="Models not loaded")

    try:
        # Extract data
        donor = request.donor
        patient = request.recipient

        # 1. Prepare raw dataframe with base columns required for engineering
        # Note: We need to construct the DataFrame carefully to match the expected feature engineering inputs
        data_dict = {
            "Patient_Age": [patient.Patient_Age],
            "Patient_BMI": [patient.Patient_BMI],
            "Patient_Weight": [patient.Patient_Weight],
            "Biological_Markers": [patient.Biological_Markers],
            "Donor_Age": [donor.Donor_Age],
            "Donor_Weight": [donor.Donor_Weight],
            "RealTime_Organ_HealthScore": [patient.RealTime_Organ_HealthScore],
            "Risk_Score": [patient.Risk_Score]
        }
        df = pd.DataFrame(data_dict)

        # 2. Feature Engineering (Must match train_model.py logic EXACTLY)
        df["Age_Difference"] = abs(df["Patient_Age"] - df["Donor_Age"])
        df["Weight_Difference"] = abs(df["Patient_Weight"] - df["Donor_Weight"])
        df["BMI_Age_Interaction"] = df["Patient_BMI"] * df["Patient_Age"]
        df["Health_Donor_Score"] = df["RealTime_Organ_HealthScore"] * (1 - df["Biological_Markers"]/10)
        df["Age_Risk_Interaction"] = df["Patient_Age"] * df["Risk_Score"]

        # 3. Select final features for model
        # Base features + Engineered features
        # Order MUST match the training order. 
        # Using a fixed list based on train_model.py analysis
        
        base_features = [
            "Patient_Age",
            "Patient_BMI",
            "Patient_Weight",
            "Biological_Markers",
            "Donor_Age",
            "Donor_Weight",
            "RealTime_Organ_HealthScore",
            "Risk_Score"
        ]

        engineered_features = [
            "Age_Difference",
            "Weight_Difference",
            "BMI_Age_Interaction",
            "Health_Donor_Score",
            "Age_Risk_Interaction"
        ]
        
        final_features_list = base_features + engineered_features
        
        X = df[final_features_list]

        # 4. Scale features
        X_scaled = scaler.transform(X)
        X_scaled_df = pd.DataFrame(X_scaled, columns=final_features_list)

        # 5. Predict
        prediction = model.predict(X_scaled_df)[0]
        prediction = max(0.0, min(100.0, prediction))
        
        # Determine Risk Level
        # Logic: Higher survival prediction -> Lower risk? 
        # Or if "Predicted_Survival_Chance" is a %, then:
        # > 80: Low Risk
        # 50-80: Moderate Risk
        # < 50: High Risk
        
        risk_level = "HIGH"
        if prediction > 80:
            risk_level = "LOW"
        elif prediction > 50:
            risk_level = "MODERATE"

        return {
            "match_score": float(prediction),
            "risk_level": risk_level,
            "status": "SUCCESS"
        }

    except Exception as e:
        print(f"Error during prediction: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def health_check():
    return {"status": "ok", "service": "ML Service"}
